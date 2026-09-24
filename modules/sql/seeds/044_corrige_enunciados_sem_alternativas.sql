-- Corrige lotes PPCE antigos que gravaram as alternativas dentro do enunciado.
-- As alternativas permanecem exclusivamente em question_version_alternatives.
begin;

update question_versions qv
set statement = case
  when q.code = 'PPCE-PORT-001'
    then 'A ideia central do texto é que'
  else btrim(split_part(qv.statement, 'A)', 1))
end
from questions q
where q.id = qv.question_id
  and qv.version = q.current_version
  and q.status = 'draft'
  and q.code like 'PPCE-PORT-%'
  and position('A)' in qv.statement) > 0;

update question_versions qv
set statement = btrim(split_part(qv.statement, 'A)', 1))
from questions q
where q.id = qv.question_id
  and qv.version = q.current_version
  and q.status = 'draft'
  and q.code like 'PPCE-INFO-%'
  and position('A)' in qv.statement) > 0;

commit;
