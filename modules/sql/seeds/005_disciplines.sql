-- ============================================================================
-- Papirar | Seed de disciplinas
-- PostgreSQL
--
-- Tabela:
--   disciplines
--
-- Este arquivo cadastra apenas as disciplinas-raiz.
-- Assuntos, tópicos e subtópicos são cadastrados separadamente.
-- ============================================================================

begin;

insert into disciplines (
  name,
  slug,
  abbreviation,
  position
)
values
  ('Língua Portuguesa',                         'portugues',                     'PORT', 10),
  ('Matemática',                               'matematica',                    'MAT', 20),
  ('Raciocínio Lógico',                        'raciocinio-logico',             'RLM', 30),
  ('Informática',                              'informatica',                   'INFO', 40),

  ('Direito Constitucional',                   'direito-constitucional',        'DC', 50),
  ('Direito Administrativo',                   'direito-administrativo',        'DAD', 60),
  ('Direito Penal',                            'direito-penal',                 'DP', 70),
  ('Direito Processual Penal',                 'direito-processual-penal',      'DPP', 80),
  ('Direito Civil',                            'direito-civil',                 'DCIV', 90),
  ('Direito Processual Civil',                 'direito-processual-civil',      'DPC', 100),
  ('Direito Tributário',                       'direito-tributario',            'DT', 110),
  ('Direito do Trabalho',                      'direito-trabalho',              'DTRAB', 120),
  ('Direito Processual do Trabalho',           'direito-processual-trabalho',   'DPT', 130),
  ('Direito Eleitoral',                        'direito-eleitoral',             'DE', 140),
  ('Direito Empresarial',                      'direito-empresarial',           'DEMP', 150),
  ('Direitos Humanos',                         'direitos-humanos',              'DH', 160),
  ('Legislação Especial',                      'legislacao-especial',           'LE', 170),

  ('Administração Pública',                    'administracao-publica',         'AP', 180),
  ('Administração Geral',                      'administracao-geral',           'AG', 190),

  ('Contabilidade Geral',                      'contabilidade-geral',           'CG', 200),
  ('Contabilidade Pública',                    'contabilidade-publica',         'CP', 210),
  ('Administração Financeira e Orçamentária',  'afo',                           'AFO', 220),

  ('Economia',                                 'economia',                      'ECO', 230),
  ('Estatística',                              'estatistica',                   'EST', 240),
  ('Arquivologia',                             'arquivologia',                  'ARQ', 250),
  ('Atualidades',                              'atualidades',                   'ATU', 260),
  ('Ética no Serviço Público',                 'etica-servico-publico',         'ESP', 270),
  ('Redação Oficial',                          'redacao-oficial',               'RO', 280)

on conflict (slug)
do update
set
  name = excluded.name,
  abbreviation = excluded.abbreviation,
  position = excluded.position,
  is_active = true;

commit;