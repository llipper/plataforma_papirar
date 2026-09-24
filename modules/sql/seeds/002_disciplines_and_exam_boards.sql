-- ============================================================================
-- Compatibilidade: disciplinas e bancas
--
-- Os dados foram separados nos seeds canônicos:
--   005_disciplines.sql
--   006_exam_boards.sql
--
-- Este arquivo não duplica mais inserts. Ele apenas valida que as migrations
-- necessárias foram aplicadas antes da execução dos seeds canônicos.
-- ============================================================================

begin;

do $$
begin
  if to_regclass('public.disciplines') is null then
    raise exception 'Tabela disciplines não existe. Execute as migrations antes dos seeds.';
  end if;

  if to_regclass('public.exam_boards') is null then
    raise exception 'Tabela exam_boards não existe. Execute as migrations antes dos seeds.';
  end if;
end;
$$;

commit;
