begin;

create index if not exists question_answers_user_question_history_idx
  on question_answers (user_id, question_id, answered_at desc, id desc);

comment on index question_answers_user_question_history_idx is
  'Leitura do ultimo status do aluno por questao sem varrer todo o historico.';

commit;
