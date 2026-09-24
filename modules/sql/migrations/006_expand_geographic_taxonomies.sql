-- ============================================================================
-- Papirar | Expansão da estrutura geográfica
-- PostgreSQL
--
-- Migration aditiva para banco já existente.
--
-- Objetivos:
--   1. Criar esferas administrativas.
--   2. Criar regiões geográficas.
--   3. Relacionar UFs às regiões.
--   4. Relacionar órgãos às esferas administrativas.
--   5. Preservar geographic_scopes durante a transição.
--
-- Não remove dados existentes.
-- ============================================================================

begin;


-- ============================================================================
-- 1. ADMINISTRATIVE SPHERES
-- ============================================================================

create table administrative_spheres (
  id uuid primary key default gen_random_uuid(),

  name varchar(80) not null,
  abbreviation varchar(16),
  slug varchar(80) not null,

  position integer not null default 0,
  is_active boolean not null default true,

  created_by uuid references app_users(id) on delete set null,
  updated_by uuid references app_users(id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint administrative_spheres_name_not_blank
    check (btrim(name) <> ''),

  constraint administrative_spheres_abbreviation_not_blank
    check (
      abbreviation is null
      or btrim(abbreviation) <> ''
    ),

  constraint administrative_spheres_slug_not_blank
    check (btrim(slug) <> '')
);

create unique index administrative_spheres_name_uq
  on administrative_spheres (lower(name));

create unique index administrative_spheres_slug_uq
  on administrative_spheres (slug);

create unique index administrative_spheres_abbreviation_uq
  on administrative_spheres (lower(abbreviation))
  where abbreviation is not null;

create index administrative_spheres_active_listing_idx
  on administrative_spheres (position, name)
  where is_active = true;

create trigger administrative_spheres_set_updated_at
before update on administrative_spheres
for each row
execute function app_set_updated_at();


-- ============================================================================
-- 2. GEOGRAPHIC REGIONS
-- ============================================================================

create table geographic_regions (
  id uuid primary key default gen_random_uuid(),

  name varchar(80) not null,
  abbreviation varchar(16),
  slug varchar(80) not null,

  position integer not null default 0,
  is_active boolean not null default true,

  created_by uuid references app_users(id) on delete set null,
  updated_by uuid references app_users(id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint geographic_regions_name_not_blank
    check (btrim(name) <> ''),

  constraint geographic_regions_abbreviation_not_blank
    check (
      abbreviation is null
      or btrim(abbreviation) <> ''
    ),

  constraint geographic_regions_slug_not_blank
    check (btrim(slug) <> '')
);

create unique index geographic_regions_name_uq
  on geographic_regions (lower(name));

create unique index geographic_regions_slug_uq
  on geographic_regions (slug);

create unique index geographic_regions_abbreviation_uq
  on geographic_regions (lower(abbreviation))
  where abbreviation is not null;

create index geographic_regions_active_listing_idx
  on geographic_regions (position, name)
  where is_active = true;

create trigger geographic_regions_set_updated_at
before update on geographic_regions
for each row
execute function app_set_updated_at();


-- ============================================================================
-- 3. FEDERATIVE UNITS -> REGION
-- ============================================================================

alter table federative_units
  add column region_id uuid;

alter table federative_units
  add constraint federative_units_region_fk
    foreign key (region_id)
    references geographic_regions(id)
    on delete restrict;

create index federative_units_region_idx
  on federative_units (region_id);


-- ============================================================================
-- 4. CAREER AGENCIES -> ADMINISTRATIVE SPHERE
-- ============================================================================

alter table career_agencies
  add column administrative_sphere_id uuid;

alter table career_agencies
  add constraint career_agencies_administrative_sphere_fk
    foreign key (administrative_sphere_id)
    references administrative_spheres(id)
    on delete restrict;

create index career_agencies_administrative_sphere_idx
  on career_agencies (administrative_sphere_id);

create index career_agencies_sphere_uf_idx
  on career_agencies (
    administrative_sphere_id,
    federative_unit_id
  );


-- ============================================================================
-- 5. REFERENCE DATA - ADMINISTRATIVE SPHERES
-- ============================================================================

insert into administrative_spheres (
  name,
  abbreviation,
  slug,
  position
)
values
  ('Federal',   'FED', 'federal',   10),
  ('Estadual',  'EST', 'estadual',  20),
  ('Distrital', 'DF',  'distrital', 30),
  ('Municipal', 'MUN', 'municipal', 40);


-- ============================================================================
-- 6. REFERENCE DATA - GEOGRAPHIC REGIONS
-- ============================================================================

insert into geographic_regions (
  name,
  abbreviation,
  slug,
  position
)
values
  ('Norte',        'N',  'norte',        10),
  ('Nordeste',     'NE', 'nordeste',     20),
  ('Centro-Oeste', 'CO', 'centro-oeste', 30),
  ('Sudeste',      'SE', 'sudeste',      40),
  ('Sul',          'S',  'sul',          50);


-- ============================================================================
-- 7. ASSOCIATE FEDERATIVE UNITS WITH REGIONS
-- ============================================================================

update federative_units
set region_id = (
  select id
  from geographic_regions
  where slug = 'norte'
)
where code in (
  'AC',
  'AP',
  'AM',
  'PA',
  'RO',
  'RR',
  'TO'
);


update federative_units
set region_id = (
  select id
  from geographic_regions
  where slug = 'nordeste'
)
where code in (
  'AL',
  'BA',
  'CE',
  'MA',
  'PB',
  'PE',
  'PI',
  'RN',
  'SE'
);


update federative_units
set region_id = (
  select id
  from geographic_regions
  where slug = 'centro-oeste'
)
where code in (
  'DF',
  'GO',
  'MT',
  'MS'
);


update federative_units
set region_id = (
  select id
  from geographic_regions
  where slug = 'sudeste'
)
where code in (
  'ES',
  'MG',
  'RJ',
  'SP'
);


update federative_units
set region_id = (
  select id
  from geographic_regions
  where slug = 'sul'
)
where code in (
  'PR',
  'RS',
  'SC'
);


-- ============================================================================
-- 8. VALIDATE FEDERATIVE UNITS
-- ============================================================================

do $$
begin
  if exists (
    select 1
    from federative_units
    where region_id is null
  ) then
    raise exception
      'Existem unidades federativas sem região geográfica.';
  end if;
end;
$$;


-- Agora que todas as UFs possuem região, podemos tornar obrigatório.

alter table federative_units
  alter column region_id set not null;


-- ============================================================================
-- 9. MIGRATE EXISTING AGENCIES
-- ============================================================================

-- Modelo anterior:
--
-- geographic_scope:
--   nacional
--   estadual
--   distrital
--   municipal
--
-- Novo modelo:
--
-- nacional  -> Federal
-- estadual  -> Estadual
-- distrital -> Distrital
-- municipal -> Municipal


update career_agencies ca
set administrative_sphere_id = (
  select asp.id
  from administrative_spheres asp
  where asp.slug = 'federal'
)
where ca.geographic_scope_id = (
  select gs.id
  from geographic_scopes gs
  where gs.slug = 'nacional'
);


update career_agencies ca
set administrative_sphere_id = (
  select asp.id
  from administrative_spheres asp
  where asp.slug = 'estadual'
)
where ca.geographic_scope_id = (
  select gs.id
  from geographic_scopes gs
  where gs.slug = 'estadual'
);


update career_agencies ca
set administrative_sphere_id = (
  select asp.id
  from administrative_spheres asp
  where asp.slug = 'distrital'
)
where ca.geographic_scope_id = (
  select gs.id
  from geographic_scopes gs
  where gs.slug = 'distrital'
);


update career_agencies ca
set administrative_sphere_id = (
  select asp.id
  from administrative_spheres asp
  where asp.slug = 'municipal'
)
where ca.geographic_scope_id = (
  select gs.id
  from geographic_scopes gs
  where gs.slug = 'municipal'
);


-- ============================================================================
-- 10. VALIDATE EXISTING AGENCIES
-- ============================================================================

do $$
begin
  if exists (
    select 1
    from career_agencies
    where administrative_sphere_id is null
  ) then
    raise exception
      'Existem órgãos sem esfera administrativa após a migração.';
  end if;
end;
$$;


-- Todos os órgãos existentes foram migrados.

alter table career_agencies
  alter column administrative_sphere_id set not null;


-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table administrative_spheres is
  'Esferas administrativas dos órgãos: federal, estadual, distrital e municipal.';

comment on table geographic_regions is
  'Regiões geográficas brasileiras utilizadas na classificação territorial.';

comment on column federative_units.region_id is
  'Região geográfica à qual pertence a unidade federativa.';

comment on column career_agencies.administrative_sphere_id is
  'Esfera administrativa à qual pertence o órgão.';


commit;