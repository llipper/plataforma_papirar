-- ============================================================================
-- Compatibilidade: taxonomias geográficas
--
-- A criação das tabelas pertence à migration:
--   004_add_career_exam_location_fields.sql
--
-- A carga dos dados de referência pertence ao seed:
--   001_geographic_reference_data.sql
--
-- Este arquivo não cria tabelas nem triggers duplicados.
-- ============================================================================

begin;

do $$
begin
  if to_regclass('public.geographic_scopes') is null then
    raise exception 'Tabela geographic_scopes não existe. Execute as migrations antes dos seeds.';
  end if;

  if to_regclass('public.federative_units') is null then
    raise exception 'Tabela federative_units não existe. Execute as migrations antes dos seeds.';
  end if;
end;
$$;

commit;
