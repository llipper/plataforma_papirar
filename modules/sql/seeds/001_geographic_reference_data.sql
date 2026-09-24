-- ============================================================================
-- Papirar | Seed de dados geográficos de referência
-- PostgreSQL
--
-- Dependências:
--   004_add_career_exam_location_fields.sql
--   006_expand_geographic_taxonomies.sql
--
-- Estrutura atual:
--
--   administrative_spheres
--     ├─ Federal
--     ├─ Estadual
--     ├─ Distrital
--     └─ Municipal
--
--   geographic_regions
--     ├─ Norte
--     ├─ Nordeste
--     ├─ Centro-Oeste
--     ├─ Sudeste
--     └─ Sul
--
--   federative_units
--     └─ vinculadas a geographic_regions
--
--   geographic_scopes
--     └─ mantida temporariamente por compatibilidade com o modelo anterior
--
-- Este seed é idempotente e pode ser executado novamente.
-- Deve ser executado antes dos seeds de carreiras/órgãos.
-- ============================================================================

begin;


-- ============================================================================
-- 1. ADMINISTRATIVE SPHERES
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
  ('Municipal', 'MUN', 'municipal', 40)

on conflict (slug)
do update
set
  name = excluded.name,
  abbreviation = excluded.abbreviation,
  position = excluded.position,
  is_active = true;


-- ============================================================================
-- 2. GEOGRAPHIC REGIONS
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
  ('Sul',          'S',  'sul',          50)

on conflict (slug)
do update
set
  name = excluded.name,
  abbreviation = excluded.abbreviation,
  position = excluded.position,
  is_active = true;


-- ============================================================================
-- 3. LEGACY GEOGRAPHIC SCOPES
--
-- Mantidos durante a transição porque career_agencies.geographic_scope_id
-- ainda existe no schema atual.
--
-- Novos fluxos devem usar administrative_sphere_id.
-- ============================================================================

insert into geographic_scopes (
  name,
  abbreviation,
  slug,
  position
)
values
  ('Nacional',  'BR',  'nacional',  10),
  ('Estadual',  'UF',  'estadual',  20),
  ('Distrital', 'DF',  'distrital', 30),
  ('Municipal', 'MUN', 'municipal', 40)

on conflict (slug)
do update
set
  name = excluded.name,
  abbreviation = excluded.abbreviation,
  position = excluded.position,
  is_active = true;


-- ============================================================================
-- 4. FEDERATIVE UNITS
--
-- Cada UF é vinculada diretamente à sua região.
-- ============================================================================

insert into federative_units (
  region_id,
  name,
  code,
  slug,
  position
)
values

  -- --------------------------------------------------------------------------
  -- NORTE
  -- --------------------------------------------------------------------------

  (
    (select id from geographic_regions where slug = 'norte'),
    'Acre',
    'AC',
    'acre',
    10
  ),

  (
    (select id from geographic_regions where slug = 'norte'),
    'Amapá',
    'AP',
    'amapa',
    20
  ),

  (
    (select id from geographic_regions where slug = 'norte'),
    'Amazonas',
    'AM',
    'amazonas',
    30
  ),

  (
    (select id from geographic_regions where slug = 'norte'),
    'Pará',
    'PA',
    'para',
    40
  ),

  (
    (select id from geographic_regions where slug = 'norte'),
    'Rondônia',
    'RO',
    'rondonia',
    50
  ),

  (
    (select id from geographic_regions where slug = 'norte'),
    'Roraima',
    'RR',
    'roraima',
    60
  ),

  (
    (select id from geographic_regions where slug = 'norte'),
    'Tocantins',
    'TO',
    'tocantins',
    70
  ),


  -- --------------------------------------------------------------------------
  -- NORDESTE
  -- --------------------------------------------------------------------------

  (
    (select id from geographic_regions where slug = 'nordeste'),
    'Alagoas',
    'AL',
    'alagoas',
    80
  ),

  (
    (select id from geographic_regions where slug = 'nordeste'),
    'Bahia',
    'BA',
    'bahia',
    90
  ),

  (
    (select id from geographic_regions where slug = 'nordeste'),
    'Ceará',
    'CE',
    'ceara',
    100
  ),

  (
    (select id from geographic_regions where slug = 'nordeste'),
    'Maranhão',
    'MA',
    'maranhao',
    110
  ),

  (
    (select id from geographic_regions where slug = 'nordeste'),
    'Paraíba',
    'PB',
    'paraiba',
    120
  ),

  (
    (select id from geographic_regions where slug = 'nordeste'),
    'Pernambuco',
    'PE',
    'pernambuco',
    130
  ),

  (
    (select id from geographic_regions where slug = 'nordeste'),
    'Piauí',
    'PI',
    'piaui',
    140
  ),

  (
    (select id from geographic_regions where slug = 'nordeste'),
    'Rio Grande do Norte',
    'RN',
    'rio-grande-do-norte',
    150
  ),

  (
    (select id from geographic_regions where slug = 'nordeste'),
    'Sergipe',
    'SE',
    'sergipe',
    160
  ),


  -- --------------------------------------------------------------------------
  -- CENTRO-OESTE
  -- --------------------------------------------------------------------------

  (
    (select id from geographic_regions where slug = 'centro-oeste'),
    'Distrito Federal',
    'DF',
    'distrito-federal',
    170
  ),

  (
    (select id from geographic_regions where slug = 'centro-oeste'),
    'Goiás',
    'GO',
    'goias',
    180
  ),

  (
    (select id from geographic_regions where slug = 'centro-oeste'),
    'Mato Grosso',
    'MT',
    'mato-grosso',
    190
  ),

  (
    (select id from geographic_regions where slug = 'centro-oeste'),
    'Mato Grosso do Sul',
    'MS',
    'mato-grosso-do-sul',
    200
  ),


  -- --------------------------------------------------------------------------
  -- SUDESTE
  -- --------------------------------------------------------------------------

  (
    (select id from geographic_regions where slug = 'sudeste'),
    'Espírito Santo',
    'ES',
    'espirito-santo',
    210
  ),

  (
    (select id from geographic_regions where slug = 'sudeste'),
    'Minas Gerais',
    'MG',
    'minas-gerais',
    220
  ),

  (
    (select id from geographic_regions where slug = 'sudeste'),
    'Rio de Janeiro',
    'RJ',
    'rio-de-janeiro',
    230
  ),

  (
    (select id from geographic_regions where slug = 'sudeste'),
    'São Paulo',
    'SP',
    'sao-paulo',
    240
  ),


  -- --------------------------------------------------------------------------
  -- SUL
  -- --------------------------------------------------------------------------

  (
    (select id from geographic_regions where slug = 'sul'),
    'Paraná',
    'PR',
    'parana',
    250
  ),

  (
    (select id from geographic_regions where slug = 'sul'),
    'Rio Grande do Sul',
    'RS',
    'rio-grande-do-sul',
    260
  ),

  (
    (select id from geographic_regions where slug = 'sul'),
    'Santa Catarina',
    'SC',
    'santa-catarina',
    270
  )

on conflict (code)
do update
set
  region_id = excluded.region_id,
  name = excluded.name,
  slug = excluded.slug,
  position = excluded.position,
  is_active = true;


-- ============================================================================
-- 5. VALIDATION
-- ============================================================================

do $$
declare
  v_spheres integer;
  v_regions integer;
  v_units integer;
  v_units_without_region integer;
begin

  select count(*)
  into v_spheres
  from administrative_spheres
  where is_active = true;

  select count(*)
  into v_regions
  from geographic_regions
  where is_active = true;

  select count(*)
  into v_units
  from federative_units
  where is_active = true;

  select count(*)
  into v_units_without_region
  from federative_units
  where region_id is null;

  if v_spheres <> 4 then
    raise exception
      'Seed geográfico inválido: esperado 4 esferas administrativas ativas, encontrado %.',
      v_spheres;
  end if;

  if v_regions <> 5 then
    raise exception
      'Seed geográfico inválido: esperado 5 regiões ativas, encontrado %.',
      v_regions;
  end if;

  if v_units <> 27 then
    raise exception
      'Seed geográfico inválido: esperado 27 unidades federativas ativas, encontrado %.',
      v_units;
  end if;

  if v_units_without_region <> 0 then
    raise exception
      'Seed geográfico inválido: existem % unidades federativas sem região.',
      v_units_without_region;
  end if;

end;
$$;


commit;
