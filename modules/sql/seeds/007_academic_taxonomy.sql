-- ============================================================================
-- Papirar | Seed da taxonomia acadêmica
-- PostgreSQL
--
-- Hierarquia:
--
-- disciplines
--   └── discipline_subjects
--         └── discipline_topics
--               └── discipline_subtopics
--
-- IDs dos pais são resolvidos pelos slugs.
-- ============================================================================

begin;


-- ============================================================================
-- DIREITO CONSTITUCIONAL
-- ============================================================================
-- ASSUNTOS
-- ============================================================================

insert into discipline_subjects (
  discipline_id,
  name,
  slug,
  position
)
values

(
  (select id from disciplines where slug = 'direito-constitucional'),
  'Teoria da Constituição',
  'teoria-constituicao',
  10
),

(
  (select id from disciplines where slug = 'direito-constitucional'),
  'Princípios Fundamentais',
  'principios-fundamentais',
  20
),

(
  (select id from disciplines where slug = 'direito-constitucional'),
  'Direitos e Garantias Fundamentais',
  'direitos-garantias-fundamentais',
  30
),

(
  (select id from disciplines where slug = 'direito-constitucional'),
  'Organização do Estado',
  'organizacao-estado',
  40
),

(
  (select id from disciplines where slug = 'direito-constitucional'),
  'Administração Pública',
  'administracao-publica',
  50
),

(
  (select id from disciplines where slug = 'direito-constitucional'),
  'Organização dos Poderes',
  'organizacao-poderes',
  60
),

(
  (select id from disciplines where slug = 'direito-constitucional'),
  'Funções Essenciais à Justiça',
  'funcoes-essenciais-justica',
  70
),

(
  (select id from disciplines where slug = 'direito-constitucional'),
  'Controle de Constitucionalidade',
  'controle-constitucionalidade',
  80
),

(
  (select id from disciplines where slug = 'direito-constitucional'),
  'Defesa do Estado e das Instituições Democráticas',
  'defesa-estado-instituicoes-democraticas',
  90
),

(
  (select id from disciplines where slug = 'direito-constitucional'),
  'Ordem Tributária e Orçamentária',
  'ordem-tributaria-orcamentaria',
  100
),

(
  (select id from disciplines where slug = 'direito-constitucional'),
  'Ordem Econômica e Financeira',
  'ordem-economica-financeira',
  110
),

(
  (select id from disciplines where slug = 'direito-constitucional'),
  'Ordem Social',
  'ordem-social',
  120
)

on conflict (discipline_id, slug)
do update
set
  name = excluded.name,
  position = excluded.position,
  is_active = true;


-- ============================================================================
-- DIREITOS E GARANTIAS FUNDAMENTAIS
-- TÓPICOS
-- ============================================================================

insert into discipline_topics (
  subject_id,
  name,
  slug,
  position
)
values

(
  (
    select ds.id
    from discipline_subjects ds
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
  ),
  'Direitos e Deveres Individuais e Coletivos',
  'direitos-deveres-individuais-coletivos',
  10
),

(
  (
    select ds.id
    from discipline_subjects ds
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
  ),
  'Direitos Sociais',
  'direitos-sociais',
  20
),

(
  (
    select ds.id
    from discipline_subjects ds
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
  ),
  'Nacionalidade',
  'nacionalidade',
  30
),

(
  (
    select ds.id
    from discipline_subjects ds
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
  ),
  'Direitos Políticos',
  'direitos-politicos',
  40
),

(
  (
    select ds.id
    from discipline_subjects ds
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
  ),
  'Partidos Políticos',
  'partidos-politicos',
  50
)

on conflict (subject_id, slug)
do update
set
  name = excluded.name,
  position = excluded.position,
  is_active = true;


-- ============================================================================
-- DIREITOS INDIVIDUAIS E COLETIVOS
-- SUBTÓPICOS
-- ============================================================================

insert into discipline_subtopics (
  topic_id,
  name,
  slug,
  position
)
values

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Direito à Vida',
  'direito-vida',
  10
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Princípio da Igualdade',
  'principio-igualdade',
  20
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Liberdade de Expressão',
  'liberdade-expressao',
  30
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Liberdade Religiosa',
  'liberdade-religiosa',
  40
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Inviolabilidade do Domicílio',
  'inviolabilidade-domicilio',
  50
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Sigilo das Comunicações',
  'sigilo-comunicacoes',
  60
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Liberdade de Associação',
  'liberdade-associacao',
  70
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Direito de Propriedade',
  'direito-propriedade',
  80
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Direito de Petição',
  'direito-peticao',
  90
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Habeas Corpus',
  'habeas-corpus',
  100
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Mandado de Segurança',
  'mandado-seguranca',
  110
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Habeas Data',
  'habeas-data',
  120
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Mandado de Injunção',
  'mandado-injuncao',
  130
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'direito-constitucional'
      and ds.slug = 'direitos-garantias-fundamentais'
      and dt.slug = 'direitos-deveres-individuais-coletivos'
  ),
  'Ação Popular',
  'acao-popular',
  140
)

on conflict (topic_id, slug)
do update
set
  name = excluded.name,
  position = excluded.position,
  is_active = true;


-- ============================================================================
-- RACIOCÍNIO LÓGICO
-- ASSUNTOS
-- ============================================================================

insert into discipline_subjects (
  discipline_id,
  name,
  slug,
  position
)
values

(
  (select id from disciplines where slug = 'raciocinio-logico'),
  'Lógica Proposicional',
  'logica-proposicional',
  10
),

(
  (select id from disciplines where slug = 'raciocinio-logico'),
  'Lógica de Argumentação',
  'logica-argumentacao',
  20
),

(
  (select id from disciplines where slug = 'raciocinio-logico'),
  'Associação Lógica',
  'associacao-logica',
  30
),

(
  (select id from disciplines where slug = 'raciocinio-logico'),
  'Sequências',
  'sequencias',
  40
),

(
  (select id from disciplines where slug = 'raciocinio-logico'),
  'Análise Combinatória',
  'analise-combinatoria',
  50
),

(
  (select id from disciplines where slug = 'raciocinio-logico'),
  'Probabilidade',
  'probabilidade',
  60
),

(
  (select id from disciplines where slug = 'raciocinio-logico'),
  'Problemas com Datas e Calendários',
  'datas-calendarios',
  70
),

(
  (select id from disciplines where slug = 'raciocinio-logico'),
  'Princípio da Casa dos Pombos',
  'principio-casa-pombos',
  80
)

on conflict (discipline_id, slug)
do update
set
  name = excluded.name,
  position = excluded.position,
  is_active = true;


-- ============================================================================
-- LÓGICA PROPOSICIONAL
-- TÓPICOS
-- ============================================================================

insert into discipline_topics (
  subject_id,
  name,
  slug,
  position
)
values

(
  (
    select ds.id
    from discipline_subjects ds
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
  ),
  'Proposições',
  'proposicoes',
  10
),

(
  (
    select ds.id
    from discipline_subjects ds
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
  ),
  'Conectivos Lógicos',
  'conectivos-logicos',
  20
),

(
  (
    select ds.id
    from discipline_subjects ds
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
  ),
  'Tabela-Verdade',
  'tabela-verdade',
  30
),

(
  (
    select ds.id
    from discipline_subjects ds
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
  ),
  'Equivalências Lógicas',
  'equivalencias-logicas',
  40
),

(
  (
    select ds.id
    from discipline_subjects ds
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
  ),
  'Negação de Proposições',
  'negacao-proposicoes',
  50
),

(
  (
    select ds.id
    from discipline_subjects ds
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
  ),
  'Tautologia, Contradição e Contingência',
  'tautologia-contradicao-contingencia',
  60
)

on conflict (subject_id, slug)
do update
set
  name = excluded.name,
  position = excluded.position,
  is_active = true;


-- ============================================================================
-- NEGAÇÃO DE PROPOSIÇÕES
-- SUBTÓPICOS
-- ============================================================================

insert into discipline_subtopics (
  topic_id,
  name,
  slug,
  position
)
values

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
      and dt.slug = 'negacao-proposicoes'
  ),
  'Negação de Proposição Simples',
  'negacao-proposicao-simples',
  10
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
      and dt.slug = 'negacao-proposicoes'
  ),
  'Negação da Conjunção',
  'negacao-conjuncao',
  20
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
      and dt.slug = 'negacao-proposicoes'
  ),
  'Negação da Disjunção',
  'negacao-disjuncao',
  30
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
      and dt.slug = 'negacao-proposicoes'
  ),
  'Negação da Condicional',
  'negacao-condicional',
  40
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
      and dt.slug = 'negacao-proposicoes'
  ),
  'Negação da Bicondicional',
  'negacao-bicondicional',
  50
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
      and dt.slug = 'negacao-proposicoes'
  ),
  'Leis de De Morgan',
  'leis-de-morgan',
  60
),

(
  (
    select dt.id
    from discipline_topics dt
    join discipline_subjects ds on ds.id = dt.subject_id
    join disciplines d on d.id = ds.discipline_id
    where d.slug = 'raciocinio-logico'
      and ds.slug = 'logica-proposicional'
      and dt.slug = 'negacao-proposicoes'
  ),
  'Negação de Proposições Categóricas',
  'negacao-proposicoes-categoricas',
  70
)

on conflict (topic_id, slug)
do update
set
  name = excluded.name,
  position = excluded.position,
  is_active = true;


commit;