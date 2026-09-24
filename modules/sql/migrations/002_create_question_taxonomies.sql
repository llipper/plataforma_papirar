begin;

-- ============================================================================
-- Papirar | Catálogos de Classificação de Questões | PostgreSQL
-- Migration: 002_create_question_taxonomies.sql
--
-- Dependência:
--   001_create_questions.sql
--
-- Banco greenfield.
--
-- Responsabilidades:
--   - Níveis de dificuldade
--   - Níveis educacionais
--   - Bancas examinadoras
--   - Tipos de questão
--   - Formatos de resposta
--   - Auditoria administrativa
--   - Associação das taxonomias às questões
--
-- NÃO pertencem a esta migration:
--   - disciplina
--   - assunto
--   - tópico
--   - subtópico
--   - carreira
--   - subcarreira
--   - instituição
--   - órgão
--   - concurso
--   - cargo
-- ============================================================================


-- ============================================================================
-- ENUMS
-- ============================================================================

create type question_answer_format as enum (
  'multiple_choice',
  'true_false',
  'free_text'
);


-- ============================================================================
-- QUESTION DIFFICULTIES
-- ============================================================================
--
-- Corresponde à tela administrativa:
--
--   Níveis de Dificuldade
--
-- Campos exibidos:
--
--   Nome da dificuldade
--   Sigla / Código
--   Peso
--   Cor
--
-- Exemplos:
--
--   Muito Fácil
--   Fácil
--   Médio
--   Difícil
--   Muito Difícil
-- ============================================================================

create table question_difficulties (
  id uuid primary key default gen_random_uuid(),

  name varchar(80) not null,

  abbreviation varchar(32),

  slug varchar(80) not null,

  weight smallint not null default 1,

  display_color varchar(7) not null default '#FFD700',

  position integer not null default 0,

  is_active boolean not null default true,

  created_by uuid
    references app_users(id)
    on delete set null,

  updated_by uuid
    references app_users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint question_difficulties_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint question_difficulties_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint question_difficulties_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint question_difficulties_weight_valid
    check (
      weight between 1 and 100
    ),

  constraint question_difficulties_color_valid
    check (
      display_color ~ '^#[0-9A-Fa-f]{6}$'
    ),

  constraint question_difficulties_position_valid
    check (
      position >= 0
    )
);


-- ============================================================================
-- EDUCATION LEVELS
-- ============================================================================
--
-- Corresponde à tela:
--
--   Níveis Educacionais
--
-- Campos:
--
--   Nome do nível
--   Sigla / Código
--
-- Exemplos:
--
--   Nível Fundamental
--   Nível Médio
--   Nível Técnico
--   Nível Superior
--   Pós-Graduação
--   Mestrado
-- ============================================================================

create table education_levels (
  id uuid primary key default gen_random_uuid(),

  name varchar(120) not null,

  abbreviation varchar(32),

  slug varchar(120) not null,

  position integer not null default 0,

  is_active boolean not null default true,

  created_by uuid
    references app_users(id)
    on delete set null,

  updated_by uuid
    references app_users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint education_levels_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint education_levels_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint education_levels_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint education_levels_position_valid
    check (
      position >= 0
    )
);


-- ============================================================================
-- EXAM BOARDS
-- ============================================================================
--
-- Corresponde à tela:
--
--   Bancas Examinadoras
--
-- Campos:
--
--   Nome da banca
--   Sigla / Código
--
-- Exemplos:
--
--   Cebraspe
--   Fundação Carlos Chagas
--   Fundação Cesgranrio
--   Fundação Getulio Vargas
--   Fundação Vunesp
--   Fundatec
--   IADES
--
-- Logo e cor NÃO fazem parte do cadastro atual e, portanto, não são
-- adicionados nesta migration.
-- ============================================================================

create table exam_boards (
  id uuid primary key default gen_random_uuid(),

  name varchar(160) not null,

  abbreviation varchar(32),

  slug varchar(160) not null,

  position integer not null default 0,

  is_active boolean not null default true,

  created_by uuid
    references app_users(id)
    on delete set null,

  updated_by uuid
    references app_users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint exam_boards_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint exam_boards_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint exam_boards_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint exam_boards_position_valid
    check (
      position >= 0
    )
);


-- ============================================================================
-- QUESTION TYPES
-- ============================================================================
--
-- Corresponde à tela:
--
--   Tipos de Questão
--
-- Campos:
--
--   Nome do tipo
--   Sigla / Código
--   Formato / Comportamento
--   Quantidade de alternativas
--
-- Formatos existentes:
--
--   multiple_choice
--     Alternativas (Múltipla escolha)
--
--   true_false
--     Certo ou errado
--
--   free_text
--     Texto (Discursiva)
--
-- A quantidade de alternativas é configuração do TIPO.
--
-- Exemplo:
--
--   Múltipla Escolha
--     answer_format      = multiple_choice
--     alternative_count = 5
--
--   Certo ou Errado
--     answer_format      = true_false
--     alternative_count = 2
--
--   Discursiva
--     answer_format      = free_text
--     alternative_count = NULL
-- ============================================================================

create table question_types (
  id uuid primary key default gen_random_uuid(),

  name varchar(120) not null,

  abbreviation varchar(32),

  slug varchar(120) not null,

  answer_format question_answer_format not null,

  alternative_count smallint,

  position integer not null default 0,

  is_active boolean not null default true,

  created_by uuid
    references app_users(id)
    on delete set null,

  updated_by uuid
    references app_users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint question_types_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint question_types_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint question_types_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint question_types_position_valid
    check (
      position >= 0
    ),

  constraint question_types_format_options_valid
    check (
      (
        answer_format = 'multiple_choice'
        and alternative_count between 2 and 10
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
    )
);


-- ============================================================================
-- UNIQUENESS
-- ============================================================================


-- --------------------------------------------------------------------------
-- Difficulties
-- --------------------------------------------------------------------------

create unique index question_difficulties_name_key
  on question_difficulties (
    lower(name)
  );


create unique index question_difficulties_slug_key
  on question_difficulties (
    slug
  );


create unique index question_difficulties_abbreviation_key
  on question_difficulties (
    lower(abbreviation)
  )
  where abbreviation is not null;


-- --------------------------------------------------------------------------
-- Education levels
-- --------------------------------------------------------------------------

create unique index education_levels_name_key
  on education_levels (
    lower(name)
  );


create unique index education_levels_slug_key
  on education_levels (
    slug
  );


create unique index education_levels_abbreviation_key
  on education_levels (
    lower(abbreviation)
  )
  where abbreviation is not null;


-- --------------------------------------------------------------------------
-- Exam boards
-- --------------------------------------------------------------------------

create unique index exam_boards_name_key
  on exam_boards (
    lower(name)
  );


create unique index exam_boards_slug_key
  on exam_boards (
    slug
  );


create unique index exam_boards_abbreviation_key
  on exam_boards (
    lower(abbreviation)
  )
  where abbreviation is not null;


-- --------------------------------------------------------------------------
-- Question types
-- --------------------------------------------------------------------------

create unique index question_types_name_key
  on question_types (
    lower(name)
  );


create unique index question_types_slug_key
  on question_types (
    slug
  );


create unique index question_types_abbreviation_key
  on question_types (
    lower(abbreviation)
  )
  where abbreviation is not null;


-- ============================================================================
-- ACTIVE LISTING INDEXES
-- ============================================================================
--
-- Utilizados principalmente pelo painel administrativo e pelos selects
-- de criação/edição de questões.
-- ============================================================================

create index question_difficulties_active_listing_idx
  on question_difficulties (
    position,
    name
  )
  where is_active;


create index education_levels_active_listing_idx
  on education_levels (
    position,
    name
  )
  where is_active;


create index exam_boards_active_listing_idx
  on exam_boards (
    position,
    name
  )
  where is_active;


create index question_types_active_listing_idx
  on question_types (
    position,
    name
  )
  where is_active;


-- ============================================================================
-- TAXONOMY AUDIT EVENTS
-- ============================================================================
--
-- Auditoria dos quatro catálogos administrativos.
--
-- A API pode informar o usuário responsável através de:
--
--   set local app.actor_id = '<uuid>';
--
-- Se não houver contexto de ator, actor_id permanece NULL.
-- ============================================================================

create table taxonomy_audit_events (
  id bigint generated always as identity primary key,

  taxonomy varchar(32) not null,

  entity_id uuid not null,

  action varchar(16) not null,

  actor_id uuid
    references app_users(id)
    on delete set null,

  before_data jsonb,

  after_data jsonb,

  occurred_at timestamptz not null default now(),

  constraint taxonomy_audit_events_taxonomy_valid
    check (
      taxonomy in (
        'difficulty',
        'education_level',
        'exam_board',
        'question_type'
      )
    ),

  constraint taxonomy_audit_events_action_valid
    check (
      action in (
        'insert',
        'update',
        'delete'
      )
    ),

  constraint taxonomy_audit_events_payload_valid
    check (
      (
        action = 'insert'
        and before_data is null
        and after_data is not null
      )
      or
      (
        action = 'update'
        and before_data is not null
        and after_data is not null
      )
      or
      (
        action = 'delete'
        and before_data is not null
        and after_data is null
      )
    ),

  constraint taxonomy_audit_events_before_object
    check (
      before_data is null
      or jsonb_typeof(before_data) = 'object'
    ),

  constraint taxonomy_audit_events_after_object
    check (
      after_data is null
      or jsonb_typeof(after_data) = 'object'
    )
);


create index taxonomy_audit_events_entity_idx
  on taxonomy_audit_events (
    taxonomy,
    entity_id,
    occurred_at desc
  );


create index taxonomy_audit_events_actor_idx
  on taxonomy_audit_events (
    actor_id,
    occurred_at desc
  )
  where actor_id is not null;


create index taxonomy_audit_events_occurred_idx
  on taxonomy_audit_events (
    occurred_at desc
  );


-- ============================================================================
-- REQUEST ACTOR HELPER
-- ============================================================================
--
-- Obtém app.actor_id de forma segura.
--
-- Se:
--
--   - não estiver definido;
--   - estiver vazio;
--   - não possuir formato UUID;
--
-- retorna NULL em vez de impedir a operação administrativa.
-- ============================================================================

create or replace function app_current_actor_id()
returns uuid
language plpgsql
stable
as $$
declare
  raw_actor_id text;
begin
  raw_actor_id :=
    nullif(
      btrim(current_setting('app.actor_id', true)),
      ''
    );

  if raw_actor_id is null then
    return null;
  end if;

  begin
    return raw_actor_id::uuid;
  exception
    when invalid_text_representation then
      return null;
  end;
end;
$$;


-- ============================================================================
-- TAXONOMY AUDIT FUNCTION
-- ============================================================================

create or replace function app_audit_taxonomy_change()
returns trigger
language plpgsql
as $$
declare
  request_actor_id uuid;
begin

  request_actor_id := app_current_actor_id();

  if tg_op = 'INSERT' then

    insert into taxonomy_audit_events (
      taxonomy,
      entity_id,
      action,
      actor_id,
      after_data
    )
    values (
      tg_argv[0],
      new.id,
      'insert',
      request_actor_id,
      to_jsonb(new)
    );

    return new;

  elsif tg_op = 'UPDATE' then

    insert into taxonomy_audit_events (
      taxonomy,
      entity_id,
      action,
      actor_id,
      before_data,
      after_data
    )
    values (
      tg_argv[0],
      new.id,
      'update',
      request_actor_id,
      to_jsonb(old),
      to_jsonb(new)
    );

    return new;

  elsif tg_op = 'DELETE' then

    insert into taxonomy_audit_events (
      taxonomy,
      entity_id,
      action,
      actor_id,
      before_data
    )
    values (
      tg_argv[0],
      old.id,
      'delete',
      request_actor_id,
      to_jsonb(old)
    );

    return old;

  end if;

  raise exception
    'Unsupported taxonomy audit operation: %',
    tg_op;

end;
$$;


-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
--
-- app_set_updated_at() foi criada na migration 001.
-- ============================================================================

create trigger question_difficulties_set_updated_at
before update on question_difficulties
for each row
execute function app_set_updated_at();


create trigger education_levels_set_updated_at
before update on education_levels
for each row
execute function app_set_updated_at();


create trigger exam_boards_set_updated_at
before update on exam_boards
for each row
execute function app_set_updated_at();


create trigger question_types_set_updated_at
before update on question_types
for each row
execute function app_set_updated_at();


-- ============================================================================
-- AUDIT TRIGGERS
-- ============================================================================

create trigger question_difficulties_audit
after insert or update or delete on question_difficulties
for each row
execute function app_audit_taxonomy_change('difficulty');


create trigger education_levels_audit
after insert or update or delete on education_levels
for each row
execute function app_audit_taxonomy_change('education_level');


create trigger exam_boards_audit
after insert or update or delete on exam_boards
for each row
execute function app_audit_taxonomy_change('exam_board');


create trigger question_types_audit
after insert or update or delete on question_types
for each row
execute function app_audit_taxonomy_change('question_type');


-- ============================================================================
-- QUESTIONS → TAXONOMIES
-- ============================================================================
--
-- Toda questão possui:
--
--   dificuldade
--   tipo
--
-- Escolaridade e banca são opcionais.
--
-- Isso é necessário para permitir:
--
--   - questões inéditas/autorais;
--   - questões sem banca;
--   - questões sem escolaridade específica.
-- ============================================================================

alter table questions
  add column question_difficulty_id uuid not null
    references question_difficulties(id)
    on delete restrict,

  add column question_type_id uuid not null
    references question_types(id)
    on delete restrict,

  add column education_level_id uuid
    references education_levels(id)
    on delete restrict,

  add column exam_board_id uuid
    references exam_boards(id)
    on delete restrict;


-- ============================================================================
-- QUESTION TAXONOMY INDEXES
-- ============================================================================


-- --------------------------------------------------------------------------
-- Difficulty
-- --------------------------------------------------------------------------

create index questions_difficulty_idx
  on questions (
    question_difficulty_id,
    updated_at desc
  );


create index questions_published_difficulty_idx
  on questions (
    question_difficulty_id,
    updated_at desc
  )
  where status = 'published';


-- --------------------------------------------------------------------------
-- Question type
-- --------------------------------------------------------------------------

create index questions_type_idx
  on questions (
    question_type_id,
    updated_at desc
  );


create index questions_published_type_idx
  on questions (
    question_type_id,
    updated_at desc
  )
  where status = 'published';


-- --------------------------------------------------------------------------
-- Education level
-- --------------------------------------------------------------------------

create index questions_education_level_idx
  on questions (
    education_level_id,
    updated_at desc
  )
  where education_level_id is not null;


create index questions_published_education_level_idx
  on questions (
    education_level_id,
    updated_at desc
  )
  where status = 'published'
    and education_level_id is not null;


-- --------------------------------------------------------------------------
-- Exam board
-- --------------------------------------------------------------------------

create index questions_exam_board_idx
  on questions (
    exam_board_id,
    updated_at desc
  )
  where exam_board_id is not null;


create index questions_published_exam_board_idx
  on questions (
    exam_board_id,
    updated_at desc
  )
  where status = 'published'
    and exam_board_id is not null;


-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table question_difficulties is
  'Catálogo administrável dos níveis de dificuldade das questões.';


comment on column question_difficulties.abbreviation is
  'Sigla ou código opcional utilizado na administração da dificuldade.';


comment on column question_difficulties.weight is
  'Peso relativo utilizado para classificação, métricas, recomendação e composição de simulados.';


comment on column question_difficulties.display_color is
  'Cor hexadecimal utilizada na representação visual do nível de dificuldade.';


comment on table education_levels is
  'Catálogo administrável dos níveis educacionais associados às questões.';


comment on column education_levels.abbreviation is
  'Sigla ou código opcional do nível educacional.';


comment on table exam_boards is
  'Catálogo administrável das bancas examinadoras.';


comment on column exam_boards.abbreviation is
  'Sigla ou código opcional da banca examinadora, como FGV, FCC ou CEBRASPE.';


comment on table question_types is
  'Catálogo administrável dos tipos de questão e respectivos comportamentos de resposta.';


comment on column question_types.abbreviation is
  'Sigla ou código opcional do tipo de questão.';


comment on column question_types.answer_format is
  'Comportamento estrutural da resposta: multiple_choice, true_false ou free_text.';


comment on column question_types.alternative_count is
  'Quantidade esperada de alternativas. Deve ser NULL para questões discursivas.';


comment on table taxonomy_audit_events is
  'Trilha de auditoria das alterações realizadas nos catálogos administrativos de questões.';


comment on column questions.question_difficulty_id is
  'Nível de dificuldade obrigatório da questão.';


comment on column questions.question_type_id is
  'Tipo e comportamento obrigatório da questão.';


comment on column questions.education_level_id is
  'Nível educacional associado à questão quando aplicável.';


comment on column questions.exam_board_id is
  'Banca examinadora associada à questão quando aplicável.';

commit;
