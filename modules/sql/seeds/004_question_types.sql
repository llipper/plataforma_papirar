-- ============================================================================
-- Papirar | Seed de tipos de questão
-- PostgreSQL
--
-- Dependência:
--   002_create_question_taxonomies.sql
--
-- Tabela:
--   question_types
--
-- Tipos iniciais suportados pela plataforma:
--
--   Múltipla Escolha
--   Certo ou Errado
--   Resposta Discursiva
--
-- answer_format:
--
--   multiple_choice -> alternativas com uma resposta correta
--   true_false      -> julgamento entre certo e errado
--   free_text       -> resposta textual/discursiva
--
-- Este seed é idempotente e pode ser executado novamente.
-- ============================================================================

begin;


-- ============================================================================
-- QUESTION TYPES
-- ============================================================================

insert into question_types (
  name,
  abbreviation,
  slug,
  answer_format,
  alternative_count,
  position
)
values

  (
    'Múltipla Escolha',
    'ME',
    'multipla-escolha',
    'multiple_choice',
    5,
    10
  ),

  (
    'Certo ou Errado',
    'CE',
    'certo-ou-errado',
    'true_false',
    2,
    20
  ),

  (
    'Resposta Discursiva',
    'RD',
    'resposta-discursiva',
    'free_text',
    null,
    30
  )

on conflict (slug)
do update
set
  name = excluded.name,
  abbreviation = excluded.abbreviation,
  answer_format = excluded.answer_format,
  alternative_count = excluded.alternative_count,
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
  from question_types
  where slug in (
    'multipla-escolha',
    'certo-ou-errado',
    'resposta-discursiva'
  )
  and is_active = true;

  if v_count <> 3 then
    raise exception
      'Seed de tipos de questão inválido: esperado 3 tipos ativos, encontrado %.',
      v_count;
  end if;

end;
$$;


commit;
