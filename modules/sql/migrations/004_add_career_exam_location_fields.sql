begin;

-- ============================================================================
-- Papirar | Taxonomias Geográficas | PostgreSQL
-- Migration: 004_add_career_exam_location_fields.sql
--
-- Dependências:
--   001_create_questions.sql
--   002_create_question_taxonomies.sql
--   003_create_content_and_career_taxonomies.sql
--
-- Banco greenfield.
--
-- Responsabilidades:
--
--   - Tipos de abrangência territorial/administrativa
--   - Unidades federativas brasileiras
--   - Associação territorial dos órgãos
--
-- Estrutura:
--
--   Carreira
--     -> Subcarreira
--       -> Órgão
--            -> Abrangência
--            -> Unidade Federativa (quando aplicável)
--         -> Concurso
--           -> Cargo
--
-- Regras:
--
--   Órgão nacional:
--
--     geographic_scope_id = Nacional
--     federative_unit_id   = NULL
--
--   Órgão estadual:
--
--     geographic_scope_id = Estadual
--     federative_unit_id   = CE / SP / RJ / ...
--
--   Órgão distrital:
--
--     geographic_scope_id = Distrital
--     federative_unit_id   = DF
--
--   Órgão municipal:
--
--     geographic_scope_id = Municipal
--     federative_unit_id   = UF do município
--
-- A localidade pertence ao órgão e NÃO ao concurso.
--
-- BR não é tratado como unidade federativa.
-- ============================================================================


-- ============================================================================
-- GEOGRAPHIC SCOPES
-- ============================================================================
--
-- Catálogo administrável.
--
-- Exemplos:
--
--   Nacional
--   Estadual
--   Distrital
--   Municipal
--
-- Sigla/Código pode ser utilizado pela administração:
--
--   NAC
--   EST
--   DIST
--   MUN
--
-- O slug funciona como identificador semântico estável utilizado pelo
-- backend para regras territoriais.
-- ============================================================================

create table geographic_scopes (
  id uuid primary key default gen_random_uuid(),

  name varchar(80) not null,

  abbreviation varchar(32),

  slug varchar(80) not null,

  position integer not null default 0,

  is_active boolean not null default true,

  created_by uuid
    references app_users(id)
    on delete set null,

  updated_by uuid
    references app_users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint geographic_scopes_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint geographic_scopes_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint geographic_scopes_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint geographic_scopes_position_valid
    check (
      position >= 0
    )
);


-- ============================================================================
-- FEDERATIVE UNITS
-- ============================================================================
--
-- Unidades federativas brasileiras.
--
-- Exemplos:
--
--   Ceará
--     code = CE
--
--   São Paulo
--     code = SP
--
--   Rio de Janeiro
--     code = RJ
--
--   Distrito Federal
--     code = DF
--
-- BR NÃO pertence a esta tabela.
-- ============================================================================

create table federative_units (
  id uuid primary key default gen_random_uuid(),

  name varchar(80) not null,

  code char(2) not null,

  slug varchar(80) not null,

  position integer not null default 0,

  is_active boolean not null default true,

  created_by uuid
    references app_users(id)
    on delete set null,

  updated_by uuid
    references app_users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint federative_units_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint federative_units_code_format
    check (
      code ~ '^[A-Z]{2}$'
    ),

  constraint federative_units_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint federative_units_position_valid
    check (
      position >= 0
    )
);


-- ============================================================================
-- UNIQUE INDEXES
-- ============================================================================


-- --------------------------------------------------------------------------
-- Geographic scopes
-- --------------------------------------------------------------------------

create unique index geographic_scopes_name_key
  on geographic_scopes (
    lower(name)
  );


create unique index geographic_scopes_slug_key
  on geographic_scopes (
    slug
  );


create unique index geographic_scopes_abbreviation_key
  on geographic_scopes (
    lower(abbreviation)
  )
  where abbreviation is not null;


-- --------------------------------------------------------------------------
-- Federative units
-- --------------------------------------------------------------------------

create unique index federative_units_name_key
  on federative_units (
    lower(name)
  );


create unique index federative_units_code_key
  on federative_units (
    code
  );


create unique index federative_units_slug_key
  on federative_units (
    slug
  );


-- ============================================================================
-- LISTING INDEXES
-- ============================================================================

create index geographic_scopes_active_listing_idx
  on geographic_scopes (
    position,
    name
  )
  where is_active;


create index federative_units_active_listing_idx
  on federative_units (
    position,
    name
  )
  where is_active;


-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
--
-- app_set_updated_at() foi criada na migration 001.
-- ============================================================================

create trigger geographic_scopes_set_updated_at
before update on geographic_scopes
for each row
execute function app_set_updated_at();


create trigger federative_units_set_updated_at
before update on federative_units
for each row
execute function app_set_updated_at();


-- ============================================================================
-- TAXONOMY AUDIT
-- ============================================================================
--
-- A migration 002 criou:
--
--   taxonomy_audit_events
--   app_audit_taxonomy_change()
--
-- Como geography também é administrada pelo mesmo painel, estendemos a
-- taxonomia de auditoria para:
--
--   geographic_scope
--   federative_unit
-- ============================================================================


-- A constraint original da 002 conhece apenas as taxonomias daquela
-- migration. Substituímos pela lista completa conhecida até o 004.

alter table taxonomy_audit_events
  drop constraint taxonomy_audit_events_taxonomy_valid;


alter table taxonomy_audit_events
  add constraint taxonomy_audit_events_taxonomy_valid
  check (
    taxonomy in (
      'difficulty',
      'education_level',
      'exam_board',
      'question_type',
      'geographic_scope',
      'federative_unit'
    )
  );


create trigger geographic_scopes_audit
after insert or update or delete on geographic_scopes
for each row
execute function app_audit_taxonomy_change(
  'geographic_scope'
);


create trigger federative_units_audit
after insert or update or delete on federative_units
for each row
execute function app_audit_taxonomy_change(
  'federative_unit'
);


-- ============================================================================
-- CAREER AGENCIES → GEOGRAPHY
-- ============================================================================
--
-- IMPORTANTE:
--
-- No desenho greenfield definitivo, career_agencies criado no 003 não deve
-- possuir:
--
--   state_name
--   uf
--   scope
--
-- O 004 passa a ser o único responsável pela territorialidade.
--
-- Portanto adicionamos somente referências normalizadas.
-- ============================================================================

alter table career_agencies
  add column geographic_scope_id uuid not null
    references geographic_scopes(id)
    on delete restrict,

  add column federative_unit_id uuid
    references federative_units(id)
    on delete restrict;


-- ============================================================================
-- LOCATION INDEXES
-- ============================================================================


-- --------------------------------------------------------------------------
-- Scope
-- --------------------------------------------------------------------------

create index career_agencies_geographic_scope_idx
  on career_agencies (
    geographic_scope_id,
    position,
    name
  )
  where is_active;


-- --------------------------------------------------------------------------
-- Federative unit
-- --------------------------------------------------------------------------

create index career_agencies_federative_unit_idx
  on career_agencies (
    federative_unit_id,
    position,
    name
  )
  where is_active
    and federative_unit_id is not null;


-- --------------------------------------------------------------------------
-- Combined filter
-- --------------------------------------------------------------------------

create index career_agencies_location_filter_idx
  on career_agencies (
    geographic_scope_id,
    federative_unit_id
  )
  where is_active;


-- ============================================================================
-- GEOGRAPHIC INTEGRITY
-- ============================================================================
--
-- Existe uma regra que não pode ser expressa corretamente por CHECK:
--
--   scope Nacional  -> UF deve ser NULL
--   scope Estadual  -> UF deve existir
--   scope Distrital -> UF deve ser DF
--   scope Municipal -> UF deve existir
--
-- Isso ocorre porque CHECK não pode consultar geographic_scopes.
--
-- Para garantir a regra também no banco, usamos constraint trigger.
-- ============================================================================

create or replace function app_validate_agency_geography()
returns trigger
language plpgsql
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
    raise exception
      'Invalid geographic_scope_id: %',
      new.geographic_scope_id;
  end if;


  if new.federative_unit_id is not null then

    select fu.code
      into federative_unit_code
    from federative_units fu
    where fu.id = new.federative_unit_id;

    if federative_unit_code is null then
      raise exception
        'Invalid federative_unit_id: %',
        new.federative_unit_id;
    end if;

  else

    federative_unit_code := null;

  end if;


  -- ------------------------------------------------------------------------
  -- National
  -- ------------------------------------------------------------------------

  if scope_slug = 'nacional' then

    if new.federative_unit_id is not null then
      raise exception
        'National agencies cannot have a federative unit.';
    end if;


  -- ------------------------------------------------------------------------
  -- State
  -- ------------------------------------------------------------------------

  elsif scope_slug = 'estadual' then

    if new.federative_unit_id is null then
      raise exception
        'State agencies must have a federative unit.';
    end if;


  -- ------------------------------------------------------------------------
  -- District
  -- ------------------------------------------------------------------------

  elsif scope_slug = 'distrital' then

    if federative_unit_code is distinct from 'DF' then
      raise exception
        'District agencies must use federative unit DF.';
    end if;


  -- ------------------------------------------------------------------------
  -- Municipal
  -- ------------------------------------------------------------------------

  elsif scope_slug = 'municipal' then

    if new.federative_unit_id is null then
      raise exception
        'Municipal agencies must have a federative unit.';
    end if;

  end if;


  return new;

end;
$$;


create trigger career_agencies_validate_geography
before insert or update of geographic_scope_id, federative_unit_id
on career_agencies
for each row
execute function app_validate_agency_geography();


-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table geographic_scopes is
  'Catálogo administrável dos tipos de abrangência territorial ou administrativa dos órgãos.';


comment on column geographic_scopes.abbreviation is
  'Sigla ou código administrativo da abrangência.';


comment on column geographic_scopes.slug is
  'Identificador semântico estável utilizado pelo backend nas regras geográficas.';


comment on table federative_units is
  'Catálogo normalizado das 27 unidades federativas brasileiras. BR não é uma unidade federativa.';


comment on column federative_units.code is
  'Sigla oficial da unidade federativa, como CE, SP, RJ ou DF.';


comment on column career_agencies.geographic_scope_id is
  'Abrangência territorial ou administrativa obrigatória do órgão.';


comment on column career_agencies.federative_unit_id is
  'Unidade federativa do órgão quando aplicável. Órgãos nacionais utilizam NULL.';

commit;
