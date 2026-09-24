begin;

create table if not exists question_answer_event_outbox (
  answer_id uuid primary key references question_answers(id) on delete cascade,
  payload jsonb not null,
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  published_at timestamptz,
  created_at timestamptz not null default now(),

  constraint question_answer_event_outbox_attempts_valid check (attempts >= 0)
);

create index if not exists question_answer_event_outbox_pending_idx
  on question_answer_event_outbox (available_at, created_at)
  where published_at is null;

comment on table question_answer_event_outbox is
  'Eventos de resposta persistidos na mesma transação da resposta antes da publicação no RabbitMQ.';

commit;
