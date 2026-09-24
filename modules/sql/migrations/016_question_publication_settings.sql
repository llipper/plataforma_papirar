begin;

alter table questions
  add column if not exists allow_comments boolean not null default true,
  add column if not exists review_mode boolean not null default false;

comment on column questions.allow_comments is
  'Permite comentários dos alunos na questão publicada.';

comment on column questions.review_mode is
  'Indica que a questão deve passar por revisão técnica antes da publicação.';

commit;
