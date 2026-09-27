-- PPCE | Português | Lote 001 | Questão 001
-- Estado: draft
-- Questão autoral de produção; não publicar automaticamente.

begin;

do $$
declare
  v_user uuid;
  v_exam uuid;
  v_position uuid;
  v_discipline uuid;
  v_subject uuid;
  v_topic uuid;
  v_subtopic uuid;
  v_difficulty uuid;
  v_type uuid;
  v_question uuid;
  v_version uuid;
begin
  select au.id into strict v_user
    from app_users au
    join user_roles ur on ur.user_id = au.id
   where au.is_active
     and ur.role = 'admin'
   order by au.created_at
   limit 1;

  select id into strict v_exam
    from career_exams
   where slug = 'concurso-ppce'
     and is_active;

  select id into strict v_position
    from career_positions
   where exam_id = v_exam
     and slug = 'policial-penal'
     and is_active;

  select id into strict v_discipline
    from disciplines
   where slug = 'portugues'
     and is_active;

  select id into strict v_subject
    from discipline_subjects
   where discipline_id = v_discipline
     and slug = 'interpretacao-textos'
     and is_active;

  select id into strict v_topic
    from discipline_topics
   where subject_id = v_subject
     and slug = 'inferencia-implicitos'
     and is_active;

  select id into strict v_subtopic
    from discipline_subtopics
   where topic_id = v_topic
     and slug = 'pressupostos'
     and is_active;

  select id into strict v_difficulty
    from question_difficulties
   where slug = 'dificil'
     and is_active;

  select id into strict v_type
    from question_types
   where slug = 'me'
     and is_active;

  insert into questions (
    organization_id, owner_id, code, visibility, status, is_original,
    allow_comments, review_mode, current_version, created_by, updated_by,
    question_difficulty_id, question_type_id, discipline_id, subject_id,
    topic_id, subtopic_id, exam_id
  ) values (
    null, v_user, 'PPCE-PORT-001', 'public', 'draft', true,
    true, false, 1, v_user, v_user,
    v_difficulty, v_type, v_discipline, v_subject,
    v_topic, v_subtopic, v_exam
  )
  on conflict (code) do update set
    status = 'draft',
    visibility = 'public',
    is_original = true,
    updated_by = excluded.updated_by,
    updated_at = now(),
    question_difficulty_id = excluded.question_difficulty_id,
    question_type_id = excluded.question_type_id,
    discipline_id = excluded.discipline_id,
    subject_id = excluded.subject_id,
    topic_id = excluded.topic_id,
    subtopic_id = excluded.subtopic_id,
    exam_id = excluded.exam_id
  returning id into v_question;

  delete from question_positions where question_id = v_question;
  delete from question_versions where question_id = v_question and version = 1;

  insert into question_versions (
    question_id, version, support_text, statement, resolution, created_by
  ) values (
    v_question,
    1,
    'Após a implantação do protocolo, a direção determinou que toda ocorrência fosse registrada no sistema imediatamente após o atendimento. A medida não eliminou divergências entre os relatos; contudo, permitiu localizar com precisão o momento em que cada informação havia sido inserida e identificar quais alterações ocorreram posteriormente. Por isso, a comissão recomendou preservar os registros originais, ainda que admitisse complementações devidamente justificadas.',
    'Com base no texto, é correto inferir que o novo protocolo',
    'O protocolo não elimina divergências, mas permite rastrear quando os registros foram inseridos e alterados. Por isso, aumenta a possibilidade de auditoria.',
    v_user
  ) returning id into v_version;

  insert into question_version_alternatives (
    question_version_id, letter, content, explanation, reference_text,
    is_correct, position
  ) values
  (
    v_version, 'A',
    'eliminou as divergências entre os relatos ao obrigar o registro imediato das ocorrências.',
    'Está incorreta porque o texto afirma expressamente que o protocolo não eliminou as divergências entre os relatos.',
    null, false, 1
  ),
  (
    v_version, 'B',
    'tornou desnecessária a análise dos relatos, pois o sistema passou a produzir informações absolutamente confiáveis.',
    'Está incorreta porque o sistema aumentou a rastreabilidade dos registros, mas não tornou as informações absolutamente confiáveis nem dispensou a análise dos relatos.',
    null, false, 2
  ),
  (
    v_version, 'C',
    'ampliou a possibilidade de auditoria dos registros, mesmo sem impedir divergências entre as informações apresentadas.',
    'Está correta porque expressa a conclusão central do texto: o protocolo melhora a rastreabilidade sem impedir divergências entre os relatos.',
    null, true, 3
  ),
  (
    v_version, 'D',
    'proibiu qualquer complementação posterior nos registros realizados pelos servidores.',
    'Está incorreta porque o texto admite complementações posteriores, desde que sejam devidamente justificadas.',
    null, false, 4
  ),
  (
    v_version, 'E',
    'determinou que as alterações posteriores fossem consideradas mais confiáveis que os registros originais.',
    'Está incorreta porque a comissão recomendou preservar os registros originais, e não atribuir maior confiabilidade às alterações posteriores.',
    null, false, 5
  );

  insert into question_references (question_version_id, content, position)
  values (
    v_version,
    'Manual de Redação da Presidência da República. Princípios de clareza, coesão e coerência textual. Consulta oficial em 25/09/2026: https://www.gov.br/pt-br/servicos/consultar-o-manual-de-redacao-da-presidencia-da-republica',
    1
  );

  insert into question_positions (question_id, exam_id, position_id, created_by)
  values (v_question, v_exam, v_position, v_user);
end $$;

commit;
