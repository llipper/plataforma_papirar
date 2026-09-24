begin;

-- ============================================================================
-- Papirar | Relações de Questões com Concursos e Cargos | PostgreSQL
-- Migration: 005_create_question_exam_relations.sql
--
-- Dependências:
--   001_create_questions.sql
--   002_create_question_taxonomies.sql
--   003_create_content_and_career_taxonomies.sql
--   004_add_career_exam_location_fields.sql
--
-- Banco greenfield.
--
-- Responsabilidades:
--
--   - Preservar o concurso/prova de origem da questão;
--   - Permitir que uma questão pertença a múltiplos cargos;
--   - Garantir que todos os cargos associados pertençam ao mesmo concurso;
--   - Criar índices para filtros por concurso e cargo;
--   - Não duplicar carreira, subcarreira, órgão ou localização em questions.
--
-- Estrutura:
--
--   Carreira
--     -> Subcarreira
--       -> Órgão
--            -> Abrangência
--            -> UF (quando aplicável)
--         -> Concurso
--           -> Cargo
--
--   Questão
--     -> Concurso de origem (opcional)
--     -> 0..N cargos do mesmo concurso
--
-- Exemplos:
--
--   Questão autoral:
--
--     exam_id = NULL
--     cargos  = nenhum
--
--   Questão PF 2025 compartilhada:
--
--     exam_id = Concurso PF 2025
--
--     cargos:
--       - Agente
--       - Escrivão
--       - Papiloscopista
--
-- ============================================================================


-- ============================================================================
-- QUESTIONS → EXAM
-- ============================================================================
--
-- O concurso de origem permanece diretamente em questions.
--
-- Isso permite identificar rapidamente:
--
--   - questões autorais;
--   - questões provenientes de concurso;
--   - questões de determinada prova;
--
-- exam_id = NULL:
--
--   questão sem concurso de origem.
--
-- exam_id = UUID:
--
--   questão proveniente de uma edição específica de concurso.
--
-- IMPORTANTE:
--
-- O 003 greenfield definitivo deve criar somente exam_id em questions.
-- position_id NÃO deve ser criado no 003.
-- ============================================================================


-- ============================================================================
-- QUESTION + EXAM CANDIDATE KEY
-- ============================================================================
--
-- question_positions precisa garantir simultaneamente que:
--
--   1. a questão pertence ao concurso informado;
--   2. o cargo pertence ao mesmo concurso.
--
-- Para isso utilizamos:
--
--   questions(id, exam_id)
--
-- como chave candidata.
--
-- PostgreSQL permite múltiplos NULL em UNIQUE.
-- Portanto questões autorais com exam_id = NULL continuam válidas.
-- ============================================================================

alter table questions
  add constraint questions_id_exam_id_key
    unique (
      id,
      exam_id
    );


-- ============================================================================
-- QUESTION POSITIONS
-- ============================================================================
--
-- Relação N:N entre questões e cargos.
--
-- Não armazenamos apenas:
--
--   question_id
--   position_id
--
-- Também armazenamos exam_id para permitir integridade referencial composta.
--
-- Dessa forma o próprio PostgreSQL impede:
--
--   Questão:
--     Concurso PF 2025
--
--   Cargo:
--     Delegado PC-SP 2023
--
-- mesmo que a aplicação possua um bug.
-- ============================================================================

create table question_positions (
  question_id uuid not null,

  exam_id uuid not null,

  position_id uuid not null,

  created_by uuid
    references app_users(id)
    on delete set null,

  created_at timestamptz not null default now(),

  primary key (
    question_id,
    position_id
  ),

  -- ------------------------------------------------------------------------
  -- A questão precisa pertencer exatamente ao concurso informado.
  -- ------------------------------------------------------------------------

  constraint question_positions_question_exam_fk
    foreign key (
      question_id,
      exam_id
    )
    references questions (
      id,
      exam_id
    )
    on delete cascade,

  -- ------------------------------------------------------------------------
  -- O cargo precisa pertencer exatamente ao mesmo concurso.
  --
  -- career_positions possui:
  --
  --   UNIQUE (exam_id, id)
  --
  -- criado na migration 003.
  -- ------------------------------------------------------------------------

  constraint question_positions_position_exam_fk
    foreign key (
      exam_id,
      position_id
    )
    references career_positions (
      exam_id,
      id
    )
    on delete restrict
);


-- ============================================================================
-- QUESTION POSITIONS INDEXES
-- ============================================================================


-- --------------------------------------------------------------------------
-- Questões pertencentes a determinado cargo
-- --------------------------------------------------------------------------

create index question_positions_position_idx
  on question_positions (
    position_id,
    question_id
  );


-- --------------------------------------------------------------------------
-- Questões pertencentes a determinado concurso através das associações
-- de cargos.
-- --------------------------------------------------------------------------

create index question_positions_exam_idx
  on question_positions (
    exam_id,
    question_id
  );


-- --------------------------------------------------------------------------
-- Cargos associados a uma questão
-- --------------------------------------------------------------------------
--
-- Não precisamos criar:
--
--   INDEX (question_id)
--
-- porque a PRIMARY KEY:
--
--   (question_id, position_id)
--
-- já possui question_id como primeira coluna.
-- ============================================================================


-- ============================================================================
-- QUESTION ORIGIN INDEXES
-- ============================================================================
--
-- questions.exam_id é utilizado para representar a origem da questão,
-- independentemente de ela possuir cargos associados.
-- ============================================================================

create index questions_exam_origin_idx
  on questions (
    exam_id,
    updated_at desc
  )
  where exam_id is not null;


-- ============================================================================
-- EXAM + BOARD FILTER
-- ============================================================================
--
-- exam_board_id continua existindo diretamente em questions.
--
-- Isso é intencional.
--
-- Exemplos:
--
-- 1. Questão proveniente de concurso:
--
--      exam_id       = PF 2025
--      exam_board_id = CEBRASPE
--
-- 2. Questão autoral criada no estilo CEBRASPE:
--
--      exam_id       = NULL
--      exam_board_id = CEBRASPE
--
-- Portanto não obrigamos:
--
--   questions.exam_board_id
--
-- a ser sempre igual a:
--
--   career_exams.exam_board_id
--
-- Essa distinção permite representar tanto origem quanto classificação
-- administrativa da questão.
-- ============================================================================

create index questions_exam_board_origin_idx
  on questions (
    exam_id,
    exam_board_id,
    updated_at desc
  )
  where exam_id is not null;


-- ============================================================================
-- CAREER NAVIGATION INDEXES
-- ============================================================================
--
-- Caminho para chegar às questões:
--
--   Carreira
--     -> Subcarreira
--       -> Órgão
--         -> Concurso
--           -> Questão
--
-- ou:
--
--   Carreira
--     -> Subcarreira
--       -> Órgão
--         -> Concurso
--           -> Cargo
--             -> Questão
--
-- Não duplicamos:
--
--   career_id
--   subcareer_id
--   agency_id
--
-- dentro de questions.
-- ============================================================================


-- --------------------------------------------------------------------------
-- Subcarreiras por carreira
-- --------------------------------------------------------------------------

create index career_subcareers_career_active_idx
  on career_subcareers (
    career_id,
    id
  )
  where is_active;


-- --------------------------------------------------------------------------
-- Órgãos por subcarreira
-- --------------------------------------------------------------------------

create index career_agencies_subcareer_active_idx
  on career_agencies (
    subcareer_id,
    id
  )
  where is_active;


-- --------------------------------------------------------------------------
-- Concursos por órgão
-- --------------------------------------------------------------------------

create index career_exams_agency_active_idx
  on career_exams (
    agency_id,
    id
  )
  where is_active;


-- --------------------------------------------------------------------------
-- Cargos por concurso
-- --------------------------------------------------------------------------

create index career_positions_exam_active_idx
  on career_positions (
    exam_id,
    id
  )
  where is_active;


-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table question_positions is
  'Relação N:N entre questões e cargos. Uma questão pode ser associada a múltiplos cargos pertencentes ao mesmo concurso de origem.';


comment on column question_positions.question_id is
  'Questão associada ao cargo.';


comment on column question_positions.exam_id is
  'Concurso compartilhado pela questão e pelo cargo; utilizado também para garantir integridade referencial.';


comment on column question_positions.position_id is
  'Cargo associado à questão dentro do concurso informado.';


comment on column question_positions.created_by is
  'Usuário administrativo responsável por criar a associação entre questão e cargo.';


comment on column questions.exam_id is
  'Concurso ou prova de origem da questão. NULL representa questão sem concurso de origem.';

commit;
