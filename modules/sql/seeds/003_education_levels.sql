-- ============================================================================
-- Papirar | Seed de níveis educacionais
-- PostgreSQL
--
-- Dependência:
--   002_create_question_taxonomies.sql
--
-- Tabela:
--   education_levels
--
-- Representa o nível de escolaridade exigido para questões, concursos,
-- cargos e demais classificações da plataforma.
--
-- Formação específica (Direito, Medicina, Engenharia etc.) NÃO pertence
-- a esta tabela.
--
-- Este seed é idempotente e pode ser executado novamente.
-- ============================================================================

begin;


-- ============================================================================
-- EDUCATION LEVELS
-- ============================================================================

insert into education_levels (
  name,
  abbreviation,
  slug,
  position
)
values

  (
    'Ensino Fundamental',
    'EF',
    'ensino-fundamental',
    10
  ),

  (
    'Ensino Médio',
    'EM',
    'ensino-medio',
    20
  ),

  (
    'Ensino Técnico',
    'ET',
    'ensino-tecnico',
    30
  ),

  (
    'Ensino Superior',
    'ES',
    'ensino-superior',
    40
  ),

  (
    'Pós-Graduação',
    'PG',
    'pos-graduacao',
    50
  ),

  (
    'Mestrado',
    'ME',
    'mestrado',
    60
  ),

  (
    'Doutorado',
    'DO',
    'doutorado',
    70
  )

on conflict (slug)
do update
set
  name = excluded.name,
  abbreviation = excluded.abbreviation,
  position = excluded.position,
  is_active = true;


-- ============================================================================
-- VALIDATION
-- ============================================================================

do $$
declare
  v_count integer;
begin

  select count(*)
  into v_count
  from education_levels
  where slug in (
    'ensino-fundamental',
    'ensino-medio',
    'ensino-tecnico',
    'ensino-superior',
    'pos-graduacao',
    'mestrado',
    'doutorado'
  )
  and is_active = true;

  if v_count <> 7 then
    raise exception
      'Seed de níveis educacionais inválido: esperado 7 níveis ativos, encontrado %.',
      v_count;
  end if;

end;
$$;


commit;
