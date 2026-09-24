begin;

-- Evita duplicar a mesma resposta quando o navegador repete uma requisição.
alter table question_answers
  add column if not exists idempotency_key uuid;

create unique index if not exists question_answers_user_idempotency_key
  on question_answers (user_id, idempotency_key)
  where idempotency_key is not null;

-- Agregado por alternativa. O histórico continua em question_answers; esta
-- tabela existe para leitura rápida da distribuição sem varrer respostas.
create table if not exists question_alternative_stats (
  question_id uuid not null
    references questions(id)
    on delete cascade,

  question_version_id uuid not null,

  alternative_id uuid not null,

  response_count bigint not null default 0,

  updated_at timestamptz not null default now(),

  primary key (question_id, alternative_id),

  constraint question_alternative_stats_version_fk
    foreign key (question_id, question_version_id)
    references question_versions(question_id, id)
    on delete cascade,

  constraint question_alternative_stats_alternative_fk
    foreign key (question_version_id, alternative_id)
    references question_version_alternatives(question_version_id, id)
    on delete cascade,

  constraint question_alternative_stats_count_valid
    check (response_count >= 0)
);

create index if not exists question_alternative_stats_question_idx
  on question_alternative_stats (question_id, question_version_id);

comment on column question_answers.idempotency_key is
  'Chave enviada pelo cliente para impedir duplicidade em retries da mesma resposta.';

comment on table question_alternative_stats is
  'Agregado assíncrono por alternativa, derivado de question_answers pelo worker.';

commit;
