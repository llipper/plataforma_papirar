begin;

-- O RabbitMQ pode entregar uma mensagem novamente depois que o worker já
-- confirmou a transação. Esta chave impede que uma resposta conte duas vezes.
create table if not exists question_answer_aggregation_events (
  answer_id uuid primary key references question_answers(id) on delete cascade,
  processed_at timestamptz not null default now()
);

comment on table question_answer_aggregation_events is
  'Chaves de idempotência do consumidor para agregação assíncrona das respostas.';

commit;
