begin;

-- ============================================================================
-- Papirar | Núcleo de Questões | PostgreSQL
-- Migration: 001_create_questions.sql
--
-- Banco greenfield.
--
-- Responsabilidades:
--   - Identidade interna dos usuários
--   - Papéis globais
--   - Organizações e membros
--   - Identidade lógica das questões
--   - Versionamento do conteúdo
--   - Alternativas
--   - Assets/imagens
--   - Objetivos
--   - Referências
--   - Vídeos/aulas relacionados à versão
--   - Publicação
--   - Histórico de respostas
--   - Respostas objetivas e discursivas
--   - Estatísticas agregadas
--   - Auditoria administrativa
--
-- NÃO pertencem a esta migration:
--   - dificuldade
--   - escolaridade
--   - banca
--   - tipo de questão
--   - disciplina
--   - assunto
--   - tópico
--   - subtópico
--   - carreira
--   - instituição
--   - órgão
--   - concurso
--   - cargo
--
-- Esses domínios serão adicionados nas migrations seguintes.
-- ============================================================================


-- ============================================================================
-- EXTENSIONS
-- ============================================================================

create extension if not exists pgcrypto;


-- ============================================================================
-- ENUMS
-- ============================================================================

create type app_role as enum (
  'student',
  'professor',
  'moderator',
  'admin'
);


create type question_status as enum (
  'draft',
  'in_review',
  'published',
  'archived'
);


create type question_visibility as enum (
  'private',
  'organization',
  'public'
);


create type question_asset_type as enum (
  'image',
  'document'
);


create type question_asset_placement as enum (
  'support',
  'statement',
  'resolution'
);


-- ============================================================================
-- USERS
-- ============================================================================
--
-- app_users representa a identidade interna no PostgreSQL.
--
-- auth_subject guarda o identificador do provedor externo.
-- Exemplo:
--
--   Firebase Authentication UID
--
-- Não armazenamos senha no PostgreSQL.
-- ============================================================================

create table app_users (
  id uuid primary key default gen_random_uuid(),

  auth_subject varchar(255) not null,
  email varchar(320) not null,

  display_name varchar(160),

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint app_users_auth_subject_not_blank
    check (
      length(btrim(auth_subject)) > 0
    ),

  constraint app_users_email_not_blank
    check (
      length(btrim(email)) > 0
    ),

  constraint app_users_display_name_not_blank
    check (
      display_name is null
      or length(btrim(display_name)) > 0
    ),

  constraint app_users_auth_subject_key
    unique (auth_subject)
);


-- E-mail case-insensitive.
create unique index app_users_email_key
  on app_users (lower(email));


-- ============================================================================
-- GLOBAL USER ROLES
-- ============================================================================

create table user_roles (
  user_id uuid not null
    references app_users(id)
    on delete cascade,

  role app_role not null,

  granted_by uuid
    references app_users(id)
    on delete set null,

  granted_at timestamptz not null default now(),

  primary key (
    user_id,
    role
  ),

  constraint user_roles_grant_not_self
    check (
      granted_by is null
      or granted_by <> user_id
    )
);


-- ============================================================================
-- ORGANIZATIONS
-- ============================================================================
--
-- Permite conteúdo pertencente a uma organização.
--
-- Mesmo que inicialmente o Papirar utilize apenas uma organização,
-- isso evita acoplar propriedade de conteúdo diretamente ao usuário.
-- ============================================================================

create table organizations (
  id uuid primary key default gen_random_uuid(),

  name varchar(160) not null,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint organizations_name_not_blank
    check (
      length(btrim(name)) > 0
    )
);


-- ============================================================================
-- ORGANIZATION MEMBERS
-- ============================================================================

create table organization_members (
  organization_id uuid not null
    references organizations(id)
    on delete cascade,

  user_id uuid not null
    references app_users(id)
    on delete cascade,

  role app_role not null default 'student',

  joined_at timestamptz not null default now(),

  primary key (
    organization_id,
    user_id
  )
);


-- ============================================================================
-- QUESTIONS
-- ============================================================================
--
-- Representa a IDENTIDADE LÓGICA da questão.
--
-- Exemplo:
--
--   Q-104859
--
-- O conteúdo apresentado ao aluno NÃO fica nesta tabela.
--
-- Texto de apoio, enunciado, resolução, alternativas etc. pertencem a
-- question_versions.
--
-- Dessa forma:
--
--   Questão Q-104859
--      versão 1
--      versão 2
--      versão 3
--
-- continua sendo a mesma questão.
-- ============================================================================

create table questions (
  id uuid primary key default gen_random_uuid(),

  organization_id uuid
    references organizations(id)
    on delete restrict,

  owner_id uuid not null
    references app_users(id)
    on delete restrict,

  code varchar(32) not null,

  visibility question_visibility not null default 'private',
  status question_status not null default 'draft',

  -- Corresponde ao conceito exibido pela UI como:
  --
  --   INÉDITA
  --
  -- Evitamos "is_unique", pois unique possui significado técnico diferente.
  is_original boolean not null default false,

  -- Versão atualmente considerada corrente.
  current_version integer not null default 1,

  created_by uuid not null
    references app_users(id)
    on delete restrict,

  updated_by uuid not null
    references app_users(id)
    on delete restrict,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  published_at timestamptz,
  archived_at timestamptz,

  constraint questions_code_not_blank
    check (
      length(btrim(code)) > 0
    ),

  constraint questions_code_key
    unique (code),

  constraint questions_current_version_valid
    check (
      current_version > 0
    ),

  constraint questions_published_date_valid
    check (
      status <> 'published'
      or published_at is not null
    ),

  constraint questions_archived_date_valid
    check (
      status <> 'archived'
      or archived_at is not null
    )
);


-- ============================================================================
-- QUESTION VERSIONS
-- ============================================================================
--
-- Todo conteúdo mutável da questão pertence à versão.
--
-- Exemplo:
--
--   support_text
--     "Em conformidade com o artigo 5º..."
--
--   statement
--     "A respeito dos direitos e deveres individuais..."
--
--   resolution
--     resolução comentada
--
--   tip
--     dica/macete
--
-- Uma versão que já tenha sido utilizada/publicada deve ser tratada como
-- historicamente imutável pela aplicação.
-- ============================================================================

create table question_versions (
  id uuid primary key default gen_random_uuid(),

  question_id uuid not null
    references questions(id)
    on delete cascade,

  version integer not null,

  support_text text,

  statement text not null,

  resolution text,

  tip text,

  created_by uuid not null
    references app_users(id)
    on delete restrict,

  created_at timestamptz not null default now(),

  published_at timestamptz,

  constraint question_versions_statement_not_blank
    check (
      length(btrim(statement)) > 0
    ),

  constraint question_versions_support_text_not_blank
    check (
      support_text is null
      or length(btrim(support_text)) > 0
    ),

  constraint question_versions_resolution_not_blank
    check (
      resolution is null
      or length(btrim(resolution)) > 0
    ),

  constraint question_versions_tip_not_blank
    check (
      tip is null
      or length(btrim(tip)) > 0
    ),

  constraint question_versions_version_valid
    check (
      version > 0
    ),

  constraint question_versions_question_version_key
    unique (
      question_id,
      version
    ),

  -- Permite FKs compostas garantindo que uma versão pertence
  -- efetivamente à questão informada.
  constraint question_versions_question_id_id_key
    unique (
      question_id,
      id
    )
);


-- ============================================================================
-- QUESTION VERSION ALTERNATIVES
-- ============================================================================
--
-- Utilizada por:
--
--   multiple_choice
--   true_false
--
-- Questões discursivas não precisam possuir registros nesta tabela.
--
-- O tipo da questão será introduzido na migration 002.
--
-- A-J permite até 10 alternativas.
-- ============================================================================

create table question_version_alternatives (
  id uuid primary key default gen_random_uuid(),

  question_version_id uuid not null
    references question_versions(id)
    on delete cascade,

  letter char(1) not null,

  content text not null,

  explanation text,

  reference_text text,

  tip text,

  is_correct boolean not null default false,

  position smallint not null,

  constraint alternatives_letter_valid
    check (
      letter in (
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J'
      )
    ),

  constraint alternatives_content_not_blank
    check (
      length(btrim(content)) > 0
    ),

  constraint alternatives_explanation_not_blank
    check (
      explanation is null
      or length(btrim(explanation)) > 0
    ),

  constraint alternatives_reference_not_blank
    check (
      reference_text is null
      or length(btrim(reference_text)) > 0
    ),

  constraint alternatives_tip_not_blank
    check (
      tip is null
      or length(btrim(tip)) > 0
    ),

  constraint alternatives_position_valid
    check (
      position between 1 and 10
    ),

  constraint alternatives_version_letter_key
    unique (
      question_version_id,
      letter
    ),

  constraint alternatives_version_position_key
    unique (
      question_version_id,
      position
    ),

  -- Necessário para validar posteriormente que uma resposta selecionou
  -- uma alternativa da mesma versão apresentada ao aluno.
  constraint alternatives_version_id_key
    unique (
      question_version_id,
      id
    )
);


-- Permite no máximo uma alternativa correta por versão.
--
-- A existência de exatamente uma alternativa correta para questões
-- objetivas será validada no fluxo de publicação após a introdução dos
-- tipos de questão na migration 002.
create unique index one_correct_alternative_per_version
  on question_version_alternatives (
    question_version_id
  )
  where is_correct;


-- ============================================================================
-- QUESTION VERSION ASSETS
-- ============================================================================
--
-- Assets pertencem à versão.
--
-- Isso é necessário para questões como as de RLM mostradas na interface,
-- nas quais o texto de apoio possui uma imagem/diagrama.
--
-- Armazenamos a chave do objeto, e NÃO uma URL assinada.
--
-- Exemplo:
--
--   questions/104859/v1/support/diagram.png
--
-- A API pode transformar object_key em URL temporária do R2.
-- ============================================================================

create table question_version_assets (
  id uuid primary key default gen_random_uuid(),

  question_version_id uuid not null
    references question_versions(id)
    on delete cascade,

  asset_type question_asset_type not null,

  placement question_asset_placement not null,

  object_key varchar(512) not null,

  alt_text varchar(500),

  caption text,

  position smallint not null default 1,

  created_at timestamptz not null default now(),

  constraint question_assets_object_key_not_blank
    check (
      length(btrim(object_key)) > 0
    ),

  constraint question_assets_alt_text_not_blank
    check (
      alt_text is null
      or length(btrim(alt_text)) > 0
    ),

  constraint question_assets_caption_not_blank
    check (
      caption is null
      or length(btrim(caption)) > 0
    ),

  constraint question_assets_position_valid
    check (
      position > 0
    ),

  constraint question_assets_version_position_key
    unique (
      question_version_id,
      placement,
      position
    )
);


-- ============================================================================
-- QUESTION OBJECTIVES
-- ============================================================================

create table question_objectives (
  id uuid primary key default gen_random_uuid(),

  question_version_id uuid not null
    references question_versions(id)
    on delete cascade,

  content text not null,

  position smallint not null,

  constraint objectives_content_not_blank
    check (
      length(btrim(content)) > 0
    ),

  constraint objectives_position_valid
    check (
      position > 0
    ),

  constraint objectives_version_position_key
    unique (
      question_version_id,
      position
    )
);


-- ============================================================================
-- QUESTION REFERENCES
-- ============================================================================
--
-- Exemplos exibidos na resolução:
--
--   Constituição Federal de 1988
--   Alexandre de Moraes...
--   Pedro Lenza...
-- ============================================================================

create table question_references (
  id uuid primary key default gen_random_uuid(),

  question_version_id uuid not null
    references question_versions(id)
    on delete cascade,

  content text not null,

  position smallint not null,

  constraint references_content_not_blank
    check (
      length(btrim(content)) > 0
    ),

  constraint references_position_valid
    check (
      position > 0
    ),

  constraint references_version_position_key
    unique (
      question_version_id,
      position
    )
);


-- ============================================================================
-- QUESTION VIDEOS
-- ============================================================================
--
-- Conteúdo audiovisual relacionado à versão.
--
-- Não representa necessariamente o vídeo bruto da questão.
-- Pode ser utilizado para aulas/resoluções em vídeo associadas.
-- ============================================================================

create table question_videos (
  id uuid primary key default gen_random_uuid(),

  question_version_id uuid not null
    references question_versions(id)
    on delete cascade,

  title varchar(240) not null,

  url text not null,

  duration_seconds integer,

  position smallint not null,

  constraint videos_title_not_blank
    check (
      length(btrim(title)) > 0
    ),

  constraint videos_url_not_blank
    check (
      length(btrim(url)) > 0
    ),

  constraint videos_duration_valid
    check (
      duration_seconds is null
      or duration_seconds > 0
    ),

  constraint videos_position_valid
    check (
      position > 0
    ),

  constraint videos_version_position_key
    unique (
      question_version_id,
      position
    )
);


-- ============================================================================
-- QUESTION PUBLICATIONS
-- ============================================================================
--
-- Mantém o histórico de qual versão foi publicada.
--
-- Exemplo:
--
--   Q-104859
--
--   versão 1 → publicada
--   versão 1 → revogada
--   versão 2 → publicada
--
-- Apenas uma publicação pode permanecer ativa por questão.
-- ============================================================================

create table question_publications (
  id uuid primary key default gen_random_uuid(),

  question_id uuid not null,

  question_version_id uuid not null,

  published_by uuid not null
    references app_users(id)
    on delete restrict,

  published_at timestamptz not null default now(),

  revoked_at timestamptz,

  revoked_by uuid
    references app_users(id)
    on delete restrict,

  constraint question_publications_dates_valid
    check (
      revoked_at is null
      or revoked_at >= published_at
    ),

  constraint question_publications_revocation_valid
    check (
      (revoked_at is null and revoked_by is null)
      or
      (revoked_at is not null and revoked_by is not null)
    ),

  constraint question_publications_question_fk
    foreign key (
      question_id
    )
    references questions(id)
    on delete cascade,

  -- Impede associar:
  --
  --   question_id = Questão A
  --   version_id  = versão da Questão B
  constraint question_publications_version_belongs_to_question_fk
    foreign key (
      question_id,
      question_version_id
    )
    references question_versions (
      question_id,
      id
    )
    on delete restrict
);


create unique index one_active_publication_per_question
  on question_publications (
    question_id
  )
  where revoked_at is null;


-- ============================================================================
-- QUESTION ANSWERS
-- ============================================================================
--
-- Histórico factual das respostas.
--
-- Suporta:
--
--   1. Múltipla escolha
--      alternative_id preenchido
--      answer_text NULL
--
--   2. Certo ou errado
--      alternative_id preenchido
--      answer_text NULL
--
--   3. Discursiva
--      alternative_id NULL
--      answer_text preenchido
--
-- O tipo da questão será introduzido na migration 002.
--
-- Não tentamos validar aqui o tipo contra a resposta porque isso exigiria
-- consultar outra tabela dentro de CHECK constraint.
-- A validação específica por formato ocorre na API/serviço de respostas.
-- ============================================================================

create table question_answers (
  id uuid primary key default gen_random_uuid(),

  question_id uuid not null,

  question_version_id uuid not null,

  user_id uuid not null
    references app_users(id)
    on delete restrict,

  alternative_id uuid,

  answer_text text,

  -- NULL é necessário para respostas discursivas que ainda dependem
  -- de correção/avaliação.
  is_correct boolean,

  time_seconds integer,

  answered_at timestamptz not null default now(),

  constraint question_answers_response_present
    check (
      alternative_id is not null
      or (
        answer_text is not null
        and length(btrim(answer_text)) > 0
      )
    ),

  constraint question_answers_single_response_kind
    check (
      not (
        alternative_id is not null
        and answer_text is not null
      )
    ),

  constraint question_answers_text_not_blank
    check (
      answer_text is null
      or length(btrim(answer_text)) > 0
    ),

  constraint question_answers_time_valid
    check (
      time_seconds is null
      or time_seconds >= 0
    ),

  constraint question_answers_question_fk
    foreign key (
      question_id
    )
    references questions(id)
    on delete restrict,

  constraint question_answers_version_belongs_to_question_fk
    foreign key (
      question_id,
      question_version_id
    )
    references question_versions (
      question_id,
      id
    )
    on delete restrict,

  -- Se alternative_id estiver preenchido, ela obrigatoriamente precisa
  -- pertencer à versão apresentada ao aluno.
  constraint question_answers_alternative_belongs_to_version_fk
    foreign key (
      question_version_id,
      alternative_id
    )
    references question_version_alternatives (
      question_version_id,
      id
    )
    on delete restrict
);


-- ============================================================================
-- QUESTION STATISTICS
-- ============================================================================
--
-- Cache agregado.
--
-- A fonte histórica continua sendo question_answers.
--
-- Não armazenamos contadores em:
--
--   dificuldade
--   disciplina
--   banca
--   carreira
--   órgão
--
-- Esses valores são derivados.
-- ============================================================================

create table question_stats (
  question_id uuid primary key
    references questions(id)
    on delete cascade,

  total_answers bigint not null default 0,

  correct_answers bigint not null default 0,

  incorrect_answers bigint not null default 0,

  pending_review_answers bigint not null default 0,

  average_time_seconds numeric(12,2),

  most_selected_wrong_letter char(1),

  updated_at timestamptz not null default now(),

  constraint question_stats_total_valid
    check (
      total_answers >= 0
    ),

  constraint question_stats_correct_valid
    check (
      correct_answers >= 0
    ),

  constraint question_stats_incorrect_valid
    check (
      incorrect_answers >= 0
    ),

  constraint question_stats_pending_valid
    check (
      pending_review_answers >= 0
    ),

  constraint question_stats_distribution_valid
    check (
      correct_answers
      + incorrect_answers
      + pending_review_answers
      <= total_answers
    ),

  constraint question_stats_average_time_valid
    check (
      average_time_seconds is null
      or average_time_seconds >= 0
    ),

  constraint question_stats_wrong_letter_valid
    check (
      most_selected_wrong_letter is null
      or most_selected_wrong_letter in (
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J'
      )
    )
);


-- ============================================================================
-- QUESTION AUDIT LOG
-- ============================================================================
--
-- Auditoria administrativa.
--
-- Diferentemente do conteúdo versionado, este log registra ações:
--
--   created
--   updated
--   submitted_for_review
--   published
--   publication_revoked
--   archived
--   restored
--   etc.
--
-- action permanece varchar para permitir evolução sem migration de ENUM.
-- ============================================================================

create table question_audit_log (
  id uuid primary key default gen_random_uuid(),

  question_id uuid not null
    references questions(id)
    on delete cascade,

  actor_id uuid
    references app_users(id)
    on delete set null,

  action varchar(64) not null,

  question_version_id uuid,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),

  constraint question_audit_action_not_blank
    check (
      length(btrim(action)) > 0
    ),

  constraint question_audit_metadata_object
    check (
      jsonb_typeof(metadata) = 'object'
    ),

  -- Não utilizamos ON DELETE SET NULL aqui.
  --
  -- Em uma FK composta isso poderia tentar definir question_id como NULL,
  -- apesar de question_id ser NOT NULL.
  --
  -- Como versões históricas não devem ser removidas individualmente depois
  -- de utilizadas, RESTRICT é mais seguro para a auditoria.
  constraint question_audit_version_belongs_to_question_fk
    foreign key (
      question_id,
      question_version_id
    )
    references question_versions (
      question_id,
      id
    )
    on delete restrict
);


-- ============================================================================
-- UPDATED_AT
-- ============================================================================
--
-- Função genérica compartilhada pelas migrations seguintes.
-- ============================================================================

create or replace function app_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


create trigger app_users_set_updated_at
before update on app_users
for each row
execute function app_set_updated_at();


create trigger organizations_set_updated_at
before update on organizations
for each row
execute function app_set_updated_at();


create trigger questions_set_updated_at
before update on questions
for each row
execute function app_set_updated_at();


-- ============================================================================
-- INDEXES
-- ============================================================================


-- --------------------------------------------------------------------------
-- Questions
-- --------------------------------------------------------------------------

create index questions_listing_idx
  on questions (
    status,
    visibility,
    updated_at desc
  );


create index questions_organization_idx
  on questions (
    organization_id,
    status,
    updated_at desc
  )
  where organization_id is not null;


create index questions_owner_idx
  on questions (
    owner_id,
    status,
    updated_at desc
  );


create index questions_original_idx
  on questions (
    is_original,
    status,
    updated_at desc
  )
  where is_original;


-- --------------------------------------------------------------------------
-- Organization members
-- --------------------------------------------------------------------------

create index organization_members_user_idx
  on organization_members (
    user_id,
    organization_id
  );


-- --------------------------------------------------------------------------
-- Versions
-- --------------------------------------------------------------------------

create index question_versions_question_idx
  on question_versions (
    question_id,
    version desc
  );


-- --------------------------------------------------------------------------
-- Alternatives
-- --------------------------------------------------------------------------
--
-- A UNIQUE(question_version_id, position) já cria índice utilizável para
-- carregamento ordenado das alternativas.
--
-- Portanto não criamos outro índice redundante com as mesmas colunas.
-- --------------------------------------------------------------------------


-- --------------------------------------------------------------------------
-- Assets
-- --------------------------------------------------------------------------

create index question_version_assets_version_idx
  on question_version_assets (
    question_version_id,
    placement,
    position
  );


-- --------------------------------------------------------------------------
-- Objectives
-- --------------------------------------------------------------------------
--
-- UNIQUE(question_version_id, position) já fornece o índice necessário.
-- --------------------------------------------------------------------------


-- --------------------------------------------------------------------------
-- References
-- --------------------------------------------------------------------------
--
-- UNIQUE(question_version_id, position) já fornece o índice necessário.
-- --------------------------------------------------------------------------


-- --------------------------------------------------------------------------
-- Videos
-- --------------------------------------------------------------------------
--
-- UNIQUE(question_version_id, position) já fornece o índice necessário.
-- --------------------------------------------------------------------------


-- --------------------------------------------------------------------------
-- Publications
-- --------------------------------------------------------------------------

create index question_publications_history_idx
  on question_publications (
    question_id,
    published_at desc
  );


create index question_publications_version_idx
  on question_publications (
    question_version_id
  );


-- --------------------------------------------------------------------------
-- Answers
-- --------------------------------------------------------------------------

create index question_answers_user_idx
  on question_answers (
    user_id,
    answered_at desc
  );


create index question_answers_question_idx
  on question_answers (
    question_id,
    answered_at desc
  );


create index question_answers_user_question_idx
  on question_answers (
    user_id,
    question_id,
    answered_at desc
  );


create index question_answers_version_idx
  on question_answers (
    question_version_id,
    answered_at desc
  );


create index question_answers_alternative_idx
  on question_answers (
    alternative_id
  )
  where alternative_id is not null;


-- --------------------------------------------------------------------------
-- Audit
-- --------------------------------------------------------------------------

create index question_audit_question_idx
  on question_audit_log (
    question_id,
    created_at desc
  );


create index question_audit_actor_idx
  on question_audit_log (
    actor_id,
    created_at desc
  )
  where actor_id is not null;


create index question_audit_version_idx
  on question_audit_log (
    question_version_id,
    created_at desc
  )
  where question_version_id is not null;


-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table app_users is
  'Identidade interna dos usuários do Papirar vinculada ao provedor externo de autenticação.';


comment on table user_roles is
  'Papéis globais utilizados pela camada de autorização do Papirar.';


comment on table organizations is
  'Organizações proprietárias ou administradoras de conteúdo.';


comment on table organization_members is
  'Associação entre usuários, organizações e papéis locais.';


comment on table questions is
  'Identidade lógica da questão. O conteúdo apresentado ao aluno pertence a question_versions.';


comment on column questions.is_original is
  'Indica questão inédita/autoral, exibida na interface como INÉDITA.';


comment on table question_versions is
  'Versões históricas do conteúdo de uma questão. Versões publicadas devem ser tratadas como imutáveis.';


comment on table question_version_alternatives is
  'Alternativas de uma versão objetiva da questão, com explicação individual e indicação de gabarito.';


comment on table question_version_assets is
  'Imagens e documentos associados ao texto de apoio, enunciado ou resolução de uma versão da questão.';


comment on column question_version_assets.object_key is
  'Chave persistente do objeto no storage. URLs temporárias ou assinadas não devem ser armazenadas.';


comment on table question_objectives is
  'Objetivos pedagógicos apresentados na resolução comentada da questão.';


comment on table question_references is
  'Referências bibliográficas, normativas ou documentais utilizadas na resolução.';


comment on table question_videos is
  'Vídeos ou aulas relacionados a uma versão específica da questão.';


comment on table question_publications is
  'Histórico das versões efetivamente publicadas e posteriormente revogadas.';


comment on table question_answers is
  'Histórico factual das respostas dos usuários, incluindo respostas objetivas e discursivas.';


comment on column question_answers.is_correct is
  'Resultado da resposta. NULL representa resposta ainda não avaliada, como uma discursiva pendente de correção.';


comment on table question_stats is
  'Cache de estatísticas agregadas derivadas do histórico de respostas.';


comment on table question_audit_log is
  'Trilha de auditoria das operações administrativas realizadas sobre questões.';


-- ============================================================================
-- SEGURANÇA / RLS
-- ============================================================================
--
-- RLS propositalmente NÃO é habilitado nesta migration.
--
-- O Firebase Authentication autentica o usuário na aplicação, mas não cria
-- automaticamente uma identidade PostgreSQL por request.
--
-- Neste estágio:
--
--   Firebase
--       ↓
--   Backend/API
--       ↓
--   PostgreSQL
--
-- A API é responsável pela autorização.
--
-- Posteriormente, caso a conexão com PostgreSQL passe a configurar:
--
--   set local app.user_id = 'UUID';
--   set local app.role = 'admin';
--
-- poderá ser criada uma migration específica para RLS.
-- ============================================================================

commit;
