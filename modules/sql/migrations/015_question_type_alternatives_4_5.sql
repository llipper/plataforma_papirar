-- ============================================================================
-- Papirar | Tipos de questão: múltipla escolha com 4 ou 5 alternativas
-- ============================================================================

begin;

alter table question_types
  drop constraint if exists question_types_format_options_valid;

alter table question_types
  add constraint question_types_format_options_valid
  check (
    (
      answer_format = 'multiple_choice'
      and alternative_count in (4, 5)
    )
    or
    (
      answer_format = 'true_false'
      and alternative_count = 2
    )
    or
    (
      answer_format = 'free_text'
      and alternative_count is null
    )
  );

comment on column question_types.alternative_count is
  'Quantidade esperada: 4 ou 5 para múltipla escolha, 2 para certo/errado e NULL para discursiva.';

commit;
