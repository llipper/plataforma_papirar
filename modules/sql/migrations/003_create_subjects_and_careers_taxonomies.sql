begin;

-- ============================================================================
-- Papirar | Hierarquias de Conteúdo e Concursos | PostgreSQL
-- Migration: 003_create_content_and_career_taxonomies.sql
--
-- Dependências:
--   001_create_questions.sql
--   002_create_question_taxonomies.sql
--
-- Banco greenfield.
--
-- Responsabilidades:
--
--   Classificação acadêmica:
--
--     Disciplina
--       -> Assunto
--         -> Tópico
--           -> Subtópico
--
--   Classificação de concursos:
--
--     Carreira
--       -> Subcarreira
--         -> Órgão
--           -> Concurso
--             -> Cargo
--
--   Associação direta das questões nesta migration:
--
--     - Disciplina
--     - Assunto
--     - Tópico
--     - Subtópico
--     - Concurso
--
--   Associação Questão <-> Cargo:
--
--     Implementada posteriormente pela migration 005 como relação N:N.
--
--   Geografia:
--
--     NÃO é definida nesta migration.
--
--     A localização/abrangência do órgão é normalizada posteriormente pela
--     migration 004 através de:
--
--       geographic_scopes
--       federative_units
--
-- A questão NÃO duplica:
--
--     carreira
--     subcarreira
--     órgão
--     UF
--     abrangência
--     ano do concurso
--
-- Esses dados são obtidos através das relações.
-- ============================================================================


-- ============================================================================
-- DISCIPLINES
-- ============================================================================

create table disciplines (
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

  constraint disciplines_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint disciplines_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint disciplines_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint disciplines_position_valid
    check (
      position >= 0
    )
);


-- ============================================================================
-- DISCIPLINE SUBJECTS
-- ============================================================================

create table discipline_subjects (
  id uuid primary key default gen_random_uuid(),

  discipline_id uuid not null
    references disciplines(id)
    on delete restrict,

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

  constraint discipline_subjects_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint discipline_subjects_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint discipline_subjects_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint discipline_subjects_position_valid
    check (
      position >= 0
    ),

  constraint discipline_subjects_discipline_id_id_key
    unique (
      discipline_id,
      id
    )
);


-- ============================================================================
-- DISCIPLINE TOPICS
-- ============================================================================

create table discipline_topics (
  id uuid primary key default gen_random_uuid(),

  subject_id uuid not null
    references discipline_subjects(id)
    on delete restrict,

  name varchar(180) not null,
  abbreviation varchar(32),
  slug varchar(180) not null,

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

  constraint discipline_topics_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint discipline_topics_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint discipline_topics_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint discipline_topics_position_valid
    check (
      position >= 0
    ),

  constraint discipline_topics_subject_id_id_key
    unique (
      subject_id,
      id
    )
);


-- ============================================================================
-- DISCIPLINE SUBTOPICS
-- ============================================================================

create table discipline_subtopics (
  id uuid primary key default gen_random_uuid(),

  topic_id uuid not null
    references discipline_topics(id)
    on delete restrict,

  name varchar(200) not null,
  abbreviation varchar(32),
  slug varchar(200) not null,

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

  constraint discipline_subtopics_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint discipline_subtopics_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint discipline_subtopics_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint discipline_subtopics_position_valid
    check (
      position >= 0
    ),

  constraint discipline_subtopics_topic_id_id_key
    unique (
      topic_id,
      id
    )
);


-- ============================================================================
-- CAREERS
-- ============================================================================

create table careers (
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

  constraint careers_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint careers_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint careers_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint careers_position_valid
    check (
      position >= 0
    )
);


-- ============================================================================
-- CAREER SUBCAREERS
-- ============================================================================

create table career_subcareers (
  id uuid primary key default gen_random_uuid(),

  career_id uuid not null
    references careers(id)
    on delete restrict,

  name varchar(180) not null,
  abbreviation varchar(32),
  slug varchar(180) not null,

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

  constraint career_subcareers_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint career_subcareers_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint career_subcareers_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint career_subcareers_position_valid
    check (
      position >= 0
    ),

  constraint career_subcareers_career_id_id_key
    unique (
      career_id,
      id
    )
);


-- ============================================================================
-- CAREER AGENCIES
-- ============================================================================
--
-- Órgão concreto.
--
-- Exemplos:
--
--   Polícia Federal
--   Polícia Rodoviária Federal
--   Polícia Civil de São Paulo
--   Polícia Civil do Ceará
--
-- IMPORTANTE:
--
--   Esta migration NÃO armazena:
--
--     state_name
--     uf
--     scope
--
--   A geografia é adicionada de forma normalizada pela migration 004.
-- ============================================================================

create table career_agencies (
  id uuid primary key default gen_random_uuid(),

  subcareer_id uuid not null
    references career_subcareers(id)
    on delete restrict,

  name varchar(180) not null,
  abbreviation varchar(32),
  slug varchar(180) not null,

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

  constraint career_agencies_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint career_agencies_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint career_agencies_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint career_agencies_position_valid
    check (
      position >= 0
    )
);


-- ============================================================================
-- CAREER EXAMS
-- ============================================================================

create table career_exams (
  id uuid primary key default gen_random_uuid(),

  agency_id uuid not null
    references career_agencies(id)
    on delete restrict,

  exam_board_id uuid
    references exam_boards(id)
    on delete restrict,

  name varchar(200) not null,
  abbreviation varchar(32),
  slug varchar(200) not null,

  exam_year smallint,

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

  constraint career_exams_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint career_exams_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint career_exams_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint career_exams_year_valid
    check (
      exam_year is null
      or exam_year between 1900 and 2200
    ),

  constraint career_exams_position_valid
    check (
      position >= 0
    ),

  constraint career_exams_agency_id_id_key
    unique (
      agency_id,
      id
    )
);


-- ============================================================================
-- CAREER POSITIONS
-- ============================================================================

create table career_positions (
  id uuid primary key default gen_random_uuid(),

  exam_id uuid not null
    references career_exams(id)
    on delete restrict,

  name varchar(200) not null,
  abbreviation varchar(32),
  slug varchar(200) not null,

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

  constraint career_positions_name_not_blank
    check (
      length(btrim(name)) > 0
    ),

  constraint career_positions_abbreviation_not_blank
    check (
      abbreviation is null
      or length(btrim(abbreviation)) > 0
    ),

  constraint career_positions_slug_format
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  constraint career_positions_position_valid
    check (
      position >= 0
    ),

  constraint career_positions_exam_id_id_key
    unique (
      exam_id,
      id
    )
);


-- ============================================================================
-- UNIQUE INDEXES
-- ============================================================================


-- --------------------------------------------------------------------------
-- Academic
-- --------------------------------------------------------------------------

create unique index disciplines_name_key
  on disciplines (
    lower(name)
  );


create unique index disciplines_slug_key
  on disciplines (
    slug
  );


create unique index disciplines_abbreviation_key
  on disciplines (
    lower(abbreviation)
  )
  where abbreviation is not null;


create unique index discipline_subjects_parent_name_key
  on discipline_subjects (
    discipline_id,
    lower(name)
  );


create unique index discipline_subjects_parent_slug_key
  on discipline_subjects (
    discipline_id,
    slug
  );


create unique index discipline_topics_parent_name_key
  on discipline_topics (
    subject_id,
    lower(name)
  );


create unique index discipline_topics_parent_slug_key
  on discipline_topics (
    subject_id,
    slug
  );


create unique index discipline_subtopics_parent_name_key
  on discipline_subtopics (
    topic_id,
    lower(name)
  );


create unique index discipline_subtopics_parent_slug_key
  on discipline_subtopics (
    topic_id,
    slug
  );


-- --------------------------------------------------------------------------
-- Careers
-- --------------------------------------------------------------------------

create unique index careers_name_key
  on careers (
    lower(name)
  );


create unique index careers_slug_key
  on careers (
    slug
  );


create unique index careers_abbreviation_key
  on careers (
    lower(abbreviation)
  )
  where abbreviation is not null;


create unique index career_subcareers_parent_name_key
  on career_subcareers (
    career_id,
    lower(name)
  );


create unique index career_subcareers_parent_slug_key
  on career_subcareers (
    career_id,
    slug
  );


create unique index career_agencies_parent_name_key
  on career_agencies (
    subcareer_id,
    lower(name)
  );


create unique index career_agencies_parent_slug_key
  on career_agencies (
    subcareer_id,
    slug
  );


create unique index career_exams_parent_slug_key
  on career_exams (
    agency_id,
    slug
  );


create unique index career_positions_parent_name_key
  on career_positions (
    exam_id,
    lower(name)
  );


create unique index career_positions_parent_slug_key
  on career_positions (
    exam_id,
    slug
  );


-- ============================================================================
-- LISTING INDEXES
-- ============================================================================


-- --------------------------------------------------------------------------
-- Academic
-- --------------------------------------------------------------------------

create index disciplines_active_listing_idx
  on disciplines (
    position,
    name
  )
  where is_active;


create index discipline_subjects_active_listing_idx
  on discipline_subjects (
    discipline_id,
    position,
    name
  )
  where is_active;


create index discipline_topics_active_listing_idx
  on discipline_topics (
    subject_id,
    position,
    name
  )
  where is_active;


create index discipline_subtopics_active_listing_idx
  on discipline_subtopics (
    topic_id,
    position,
    name
  )
  where is_active;


-- --------------------------------------------------------------------------
-- Careers
-- --------------------------------------------------------------------------

create index careers_active_listing_idx
  on careers (
    position,
    name
  )
  where is_active;


create index career_subcareers_active_listing_idx
  on career_subcareers (
    career_id,
    position,
    name
  )
  where is_active;


create index career_agencies_active_listing_idx
  on career_agencies (
    subcareer_id,
    position,
    name
  )
  where is_active;


create index career_exams_active_listing_idx
  on career_exams (
    agency_id,
    exam_year desc,
    position,
    name
  )
  where is_active;


create index career_exams_board_idx
  on career_exams (
    exam_board_id,
    exam_year desc
  )
  where exam_board_id is not null;


create index career_positions_active_listing_idx
  on career_positions (
    exam_id,
    position,
    name
  )
  where is_active;


-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
--
-- app_set_updated_at() foi criada em 001.
-- ============================================================================

create trigger disciplines_set_updated_at
before update on disciplines
for each row
execute function app_set_updated_at();


create trigger discipline_subjects_set_updated_at
before update on discipline_subjects
for each row
execute function app_set_updated_at();


create trigger discipline_topics_set_updated_at
before update on discipline_topics
for each row
execute function app_set_updated_at();


create trigger discipline_subtopics_set_updated_at
before update on discipline_subtopics
for each row
execute function app_set_updated_at();


create trigger careers_set_updated_at
before update on careers
for each row
execute function app_set_updated_at();


create trigger career_subcareers_set_updated_at
before update on career_subcareers
for each row
execute function app_set_updated_at();


create trigger career_agencies_set_updated_at
before update on career_agencies
for each row
execute function app_set_updated_at();


create trigger career_exams_set_updated_at
before update on career_exams
for each row
execute function app_set_updated_at();


create trigger career_positions_set_updated_at
before update on career_positions
for each row
execute function app_set_updated_at();


-- ============================================================================
-- QUESTIONS → ACADEMIC CLASSIFICATION
-- ============================================================================

alter table questions
  add column discipline_id uuid not null,

  add column subject_id uuid,

  add column topic_id uuid,

  add column subtopic_id uuid,

  add constraint questions_discipline_fk
    foreign key (
      discipline_id
    )
    references disciplines (
      id
    )
    on delete restrict,

  add constraint questions_subject_belongs_to_discipline_fk
    foreign key (
      discipline_id,
      subject_id
    )
    references discipline_subjects (
      discipline_id,
      id
    )
    on delete restrict,

  add constraint questions_topic_belongs_to_subject_fk
    foreign key (
      subject_id,
      topic_id
    )
    references discipline_topics (
      subject_id,
      id
    )
    on delete restrict,

  add constraint questions_subtopic_belongs_to_topic_fk
    foreign key (
      topic_id,
      subtopic_id
    )
    references discipline_subtopics (
      topic_id,
      id
    )
    on delete restrict,

  add constraint questions_academic_hierarchy_valid
    check (
      (
        subject_id is null
        and topic_id is null
        and subtopic_id is null
      )

      or

      (
        subject_id is not null
        and topic_id is null
        and subtopic_id is null
      )

      or

      (
        subject_id is not null
        and topic_id is not null
        and subtopic_id is null
      )

      or

      (
        subject_id is not null
        and topic_id is not null
        and subtopic_id is not null
      )
    );


-- ============================================================================
-- QUESTIONS → EXAM
-- ============================================================================
--
-- O concurso de origem pode ser NULL para questão autoral/inédita.
--
-- NÃO existe position_id diretamente em questions.
--
-- Uma questão pode estar associada a múltiplos cargos do mesmo concurso.
-- Essa relação será criada pela migration 005.
-- ============================================================================

alter table questions
  add column exam_id uuid,

  add constraint questions_exam_fk
    foreign key (
      exam_id
    )
    references career_exams (
      id
    )
    on delete restrict;


-- ============================================================================
-- QUESTION ACADEMIC INDEXES
-- ============================================================================

create index questions_discipline_idx
  on questions (
    discipline_id,
    updated_at desc
  );


create index questions_published_discipline_idx
  on questions (
    discipline_id,
    updated_at desc
  )
  where status = 'published';


create index questions_subject_idx
  on questions (
    subject_id,
    updated_at desc
  )
  where subject_id is not null;


create index questions_published_subject_idx
  on questions (
    subject_id,
    updated_at desc
  )
  where status = 'published'
    and subject_id is not null;


create index questions_topic_idx
  on questions (
    topic_id,
    updated_at desc
  )
  where topic_id is not null;


create index questions_published_topic_idx
  on questions (
    topic_id,
    updated_at desc
  )
  where status = 'published'
    and topic_id is not null;


create index questions_subtopic_idx
  on questions (
    subtopic_id,
    updated_at desc
  )
  where subtopic_id is not null;


create index questions_published_subtopic_idx
  on questions (
    subtopic_id,
    updated_at desc
  )
  where status = 'published'
    and subtopic_id is not null;


-- ============================================================================
-- QUESTION EXAM INDEXES
-- ============================================================================

create index questions_exam_idx
  on questions (
    exam_id,
    updated_at desc
  )
  where exam_id is not null;


create index questions_published_exam_idx
  on questions (
    exam_id,
    updated_at desc
  )
  where status = 'published'
    and exam_id is not null;


-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table disciplines is
  'Raiz da classificação acadêmica: Disciplina -> Assunto -> Tópico -> Subtópico.';


comment on table discipline_subjects is
  'Assuntos pertencentes a uma disciplina.';


comment on table discipline_topics is
  'Tópicos pertencentes a um assunto.';


comment on table discipline_subtopics is
  'Subtópicos pertencentes a um tópico.';


comment on table careers is
  'Raiz da classificação de carreiras do Papirar.';


comment on table career_subcareers is
  'Segundo nível da classificação de carreiras, como Polícia dentro de Segurança Pública.';


comment on table career_agencies is
  'Órgãos concretos associados a uma subcarreira. A geografia é normalizada pela migration 004.';


comment on table career_exams is
  'Edições concretas de concursos pertencentes a um órgão.';


comment on column career_exams.exam_year is
  'Ano da edição do concurso.';


comment on column career_exams.exam_board_id is
  'Banca responsável pela edição do concurso quando conhecida.';


comment on table career_positions is
  'Cargos pertencentes a uma edição específica de concurso.';


comment on column questions.discipline_id is
  'Disciplina obrigatória da questão.';


comment on column questions.subject_id is
  'Assunto da questão dentro da disciplina.';


comment on column questions.topic_id is
  'Tópico da questão dentro do assunto.';


comment on column questions.subtopic_id is
  'Subtópico mais específico da classificação acadêmica da questão.';


comment on column questions.exam_id is
  'Concurso de origem da questão quando proveniente de prova real.';

commit;
