-- ============================================================================
-- Papirar | Seed de dificuldades das questões
-- PostgreSQL
--
-- Dependência:
--   002_create_question_taxonomies.sql
--
-- Tabela:
--   question_difficulties
--
-- Níveis oficiais utilizados pela plataforma:
--
--   Fácil
--   Médio
--   Difícil
--   Muito Difícil
--
-- O campo weight representa o peso relativo da dificuldade.
-- Pode ser utilizado futuramente para:
--
--   - cálculo de métricas;
--   - seleção adaptativa de questões;
--   - geração de simulados;
--   - análise de desempenho;
--   - distribuição de dificuldade.
--
-- Este seed é idempotente e pode ser executado novamente.
-- ============================================================================

begin;


-- ============================================================================
-- QUESTION DIFFICULTIES
-- ============================================================================

insert into question_difficulties (
  name,
  abbreviation,
  slug,
  weight,
  display_color,
  position
)
values

  (
    'Fácil',
    'F',
    'facil',
    1,
    '#22C55E',
    10
  ),

  (
    'Médio',
    'M',
    'medio',
    2,
    '#EAB308',
    20
  ),

  (
    'Difícil',
    'D',
    'dificil',
    3,
    '#F97316',
    30
  ),

  (
    'Muito Difícil',
    'MD',
    'muito-dificil',
    4,
    '#EF4444',
    40
  )

on conflict (slug)
do update
set
  name = excluded.name,
  abbreviation = excluded.abbreviation,
  weight = excluded.weight,
  display_color = excluded.display_color,
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
  from question_difficulties
  where slug in (
    'facil',
    'medio',
    'dificil',
    'muito-dificil'
  )
  and is_active = true;

  if v_count <> 4 then
    raise exception
      'Seed de dificuldades inválido: esperado 4 dificuldades ativas, encontrado %.',
      v_count;
  end if;

end;
$$;


commit;
