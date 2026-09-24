-- ============================================================================
-- Papirar | Seed de bancas examinadoras
-- PostgreSQL
-- ============================================================================

begin;

insert into exam_boards (
  name,
  slug,
  abbreviation,
  position
)
values
  ('Cebraspe',                                           'cebraspe',        'CEBRASPE', 10),
  ('Fundação Getulio Vargas',                            'fgv',             'FGV', 20),
  ('Fundação Carlos Chagas',                             'fcc',             'FCC', 30),
  ('Fundação Vunesp',                                    'vunesp',          'VUNESP', 40),
  ('Instituto AOCP',                                     'aocp',            'AOCP', 50),
  ('Instituto Brasileiro de Formação e Capacitação',     'ibfc',            'IBFC', 60),
  ('Instituto Consulplan',                               'consulplan',      'CONSULPLAN', 70),
  ('Instituto de Desenvolvimento Educacional, Cultural e Assistencial Nacional',
                                                        'idecan',          'IDECAN', 80),
  ('Instituto Americano de Desenvolvimento',             'iades',           'IADES', 90),
  ('Fundação Cesgranrio',                                'cesgranrio',      'CESGRANRIO', 100),
  ('Instituto Quadrix',                                  'quadrix',         'QUADRIX', 110),
  ('Instituto ACCESS',                                   'access',          'ACCESS', 120),
  ('Legalle Concursos',                                  'legalle',         'LEGALLE', 130),
  ('Fundatec',                                           'fundatec',        'FUNDATEC', 140),
  ('Instituto Selecon',                                  'selecon',         'SELECON', 150),
  ('Instituto Brasileiro de Apoio e Desenvolvimento Executivo',
                                                        'ibade',           'IBADE', 160),
  ('Fundação de Apoio à Pesquisa, Ensino e Assistência', 'funrio',          'FUNRIO', 170),
  ('Instituto de Desenvolvimento Institucional Brasileiro',
                                                        'idib',            'IDIB', 180),
  ('Instituto Verbena',                                  'instituto-verbena','VERBENA', 190),
  ('Fundação de Apoio à Pesquisa, ao Ensino e à Cultura','fapec',           'FAPEC', 200),
  ('Objetiva Concursos',                                 'objetiva',        'OBJETIVA', 210),
  ('Avança SP',                                          'avanca-sp',       'AVANÇA SP', 220),
  ('Nosso Rumo',                                         'nosso-rumo',      'NOSSO RUMO', 230),
  ('Instituto Mais',                                     'instituto-mais',  'MAIS', 240),
  ('ConsulPAM',                                          'consulpam',       'CONSULPAM', 250)

on conflict (slug)
do update
set
  name = excluded.name,
  abbreviation = excluded.abbreviation,
  position = excluded.position,
  is_active = true;

commit;