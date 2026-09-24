begin;

-- ============================================================================
-- Papirar | Baseline de segurança do banco
--
-- Esta migration deve ser aplicada depois das migrations 001..006 e depois
-- dos seeds. O runtime deve usar uma role sem ownership das tabelas.
-- ============================================================================

create or replace function app_current_user_id()
returns uuid
language plpgsql
stable
set search_path = pg_catalog
as $$
declare
  raw_user_id text;
begin
  raw_user_id := nullif(btrim(current_setting('app.user_id', true)), '');

  if raw_user_id is null then
    return null;
  end if;

  begin
    return raw_user_id::uuid;
  exception
    when invalid_text_representation then
      return null;
  end;
end;
$$;


create or replace function app_is_admin()
returns boolean
language sql
stable
set search_path = pg_catalog
as $$
  select current_setting('app.role', true) = 'admin';
$$;


-- Auditoria administrativa deve falhar fechado: uma alteração sem ator
-- verificável não pode ser registrada como se fosse uma operação confiável.
create or replace function app_current_actor_id()
returns uuid
language plpgsql
stable
set search_path = pg_catalog
as $$
declare
  raw_actor_id text;
begin
  raw_actor_id := nullif(btrim(current_setting('app.actor_id', true)), '');

  if raw_actor_id is null then
    raise exception 'app.actor_id is required for audited administrative changes';
  end if;

  begin
    return raw_actor_id::uuid;
  exception
    when invalid_text_representation then
      raise exception 'app.actor_id must be a valid UUID';
  end;
end;
$$;


-- ============================================================================
-- INTEGRIDADE GEOGRÁFICA
-- ============================================================================

create or replace function app_validate_agency_geography()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
declare
  scope_slug text;
  federative_unit_code text;
begin
  select gs.slug
    into scope_slug
  from geographic_scopes gs
  where gs.id = new.geographic_scope_id;

  if scope_slug is null then
    raise exception 'Invalid geographic_scope_id: %', new.geographic_scope_id;
  end if;

  if scope_slug not in ('nacional', 'estadual', 'distrital', 'municipal') then
    raise exception 'Unsupported geographic scope slug: %', scope_slug;
  end if;

  if new.federative_unit_id is not null then
    select fu.code
      into federative_unit_code
    from federative_units fu
    where fu.id = new.federative_unit_id;

    if federative_unit_code is null then
      raise exception 'Invalid federative_unit_id: %', new.federative_unit_id;
    end if;
  end if;

  if scope_slug = 'nacional' and new.federative_unit_id is not null then
    raise exception 'National agencies cannot have a federative unit.';
  elsif scope_slug = 'estadual' and new.federative_unit_id is null then
    raise exception 'State agencies must have a federative unit.';
  elsif scope_slug = 'distrital' and federative_unit_code is distinct from 'DF' then
    raise exception 'District agencies must use federative unit DF.';
  elsif scope_slug = 'municipal' and new.federative_unit_id is null then
    raise exception 'Municipal agencies must have a federative unit.';
  end if;

  return new;
end;
$$;


-- Slugs e códigos são identificadores estáveis. Alterá-los enquanto houver
-- órgãos dependentes invalidaria a regra territorial já gravada.
create or replace function app_prevent_referenced_geography_identity_change()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if new.slug is distinct from old.slug and exists (
    select 1
    from career_agencies ca
    where ca.geographic_scope_id = old.id
  ) then
    raise exception 'Cannot change geographic scope slug while agencies reference it';
  end if;

  return new;
end;
$$;


create or replace function app_prevent_referenced_federative_code_change()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if new.code is distinct from old.code and exists (
    select 1
    from career_agencies ca
    where ca.federative_unit_id = old.id
  ) then
    raise exception 'Cannot change federative unit code while agencies reference it';
  end if;

  return new;
end;
$$;


create trigger geographic_scopes_identity_guard
before update of slug on geographic_scopes
for each row
execute function app_prevent_referenced_geography_identity_change();


create trigger federative_units_identity_guard
before update of code on federative_units
for each row
execute function app_prevent_referenced_federative_code_change();


-- ============================================================================
-- RLS: deny by default, with explicit access paths
-- ============================================================================

alter table app_users enable row level security;
alter table user_roles enable row level security;
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table questions enable row level security;
alter table question_versions enable row level security;
alter table question_version_alternatives enable row level security;
alter table question_version_assets enable row level security;
alter table question_objectives enable row level security;
alter table question_references enable row level security;
alter table question_videos enable row level security;
alter table question_publications enable row level security;
alter table question_answers enable row level security;
alter table question_stats enable row level security;

-- Catálogos podem ser lidos quando ativos, mas somente o contexto
-- administrativo pode criar, editar ou desativar registros.
do $$
declare
  catalog_table text;
begin
  foreach catalog_table in array array[
    'question_difficulties',
    'education_levels',
    'exam_boards',
    'question_types',
    'geographic_scopes',
    'federative_units',
    'administrative_spheres',
    'geographic_regions',
    'disciplines',
    'discipline_subjects',
    'discipline_topics',
    'discipline_subtopics',
    'careers',
    'career_subcareers',
    'career_agencies',
    'career_exams',
    'career_positions'
  ] loop
    execute format('alter table public.%I enable row level security', catalog_table);
    execute format(
      'create policy %I on public.%I for select using (is_active or app_is_admin())',
      'papirar_' || catalog_table || '_read',
      catalog_table
    );
    execute format(
      'create policy %I on public.%I for all using (app_is_admin()) with check (app_is_admin())',
      'papirar_' || catalog_table || '_admin_write',
      catalog_table
    );
  end loop;
end;
$$;

-- Identidade e memberships.
create policy app_users_read on app_users
for select using (app_is_admin() or id = app_current_user_id());

create policy user_roles_read on user_roles
for select using (app_is_admin() or user_id = app_current_user_id());

create policy organizations_read on organizations
for select using (
  app_is_admin()
  or exists (
    select 1 from organization_members om
    where om.organization_id = organizations.id
      and om.user_id = app_current_user_id()
  )
);

create policy organization_members_read on organization_members
for select using (
  app_is_admin()
  or user_id = app_current_user_id()
);

create policy organization_members_admin_write on organization_members
for all using (app_is_admin()) with check (app_is_admin());

-- Questões públicas publicadas ou privadas pertencentes ao usuário/organização.
create policy questions_read on questions
for select using (
  app_is_admin()
  or owner_id = app_current_user_id()
  or (visibility = 'public' and status = 'published')
  or exists (
    select 1 from organization_members om
    where om.organization_id = questions.organization_id
      and om.user_id = app_current_user_id()
  )
);

create policy questions_insert on questions
for insert with check (
  app_is_admin()
  or (owner_id = app_current_user_id() and created_by = app_current_user_id())
);

create policy questions_update on questions
for update using (
  app_is_admin() or owner_id = app_current_user_id()
) with check (
  app_is_admin() or owner_id = app_current_user_id()
);

create policy questions_delete on questions
for delete using (app_is_admin() or owner_id = app_current_user_id());

-- Conteúdo derivado de uma questão obedece à mesma visibilidade da questão.
create policy question_versions_read on question_versions
for select using (
  exists (select 1 from questions q where q.id = question_versions.question_id)
);

create policy question_versions_write on question_versions
for all using (
  app_is_admin()
  or exists (
    select 1 from questions q
    where q.id = question_versions.question_id
      and q.owner_id = app_current_user_id()
  )
) with check (
  app_is_admin()
  or exists (
    select 1 from questions q
    where q.id = question_versions.question_id
      and q.owner_id = app_current_user_id()
  )
);

create policy question_alternatives_access on question_version_alternatives
for all using (
  app_is_admin()
  or exists (
    select 1 from question_versions qv
    join questions q on q.id = qv.question_id
    where qv.id = question_version_alternatives.question_version_id
      and (q.owner_id = app_current_user_id() or (q.visibility = 'public' and q.status = 'published'))
  )
) with check (app_is_admin());

create policy question_assets_access on question_version_assets
for all using (app_is_admin()) with check (app_is_admin());

create policy question_objectives_access on question_objectives
for all using (app_is_admin()) with check (app_is_admin());

create policy question_references_access on question_references
for all using (app_is_admin()) with check (app_is_admin());

create policy question_videos_access on question_videos
for all using (app_is_admin()) with check (app_is_admin());

create policy question_publications_access on question_publications
for all using (app_is_admin()) with check (app_is_admin());

create policy question_answers_read on question_answers
for select using (app_is_admin() or user_id = app_current_user_id());

create policy question_answers_insert on question_answers
for insert with check (user_id = app_current_user_id());

create policy question_stats_read on question_stats
for select using (
  app_is_admin()
  or exists (
    select 1 from questions q
    where q.id = question_stats.question_id
      and q.visibility = 'public'
      and q.status = 'published'
  )
);

commit;
