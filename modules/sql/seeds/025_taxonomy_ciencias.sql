-- Ciências da Natureza: base comum para carreiras que cobram conhecimentos gerais.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Mecânica','mecanica',10),('Termologia','termologia',20),('Eletricidade','eletricidade',30),('Óptica','optica',40)
) v(name,slug,position) where d.slug='fisica'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Química Geral','quimica-geral',10),('Físico-Química','fisico-quimica',20),('Química Orgânica','quimica-organica',30),('Química Ambiental','quimica-ambiental',40)
) v(name,slug,position) where d.slug='quimica'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Biologia Celular','biologia-celular',10),('Genética e Evolução','genetica-evolucao',20),('Ecologia','ecologia',30),('Fisiologia Humana','fisiologia-humana',40),('Saúde Pública','saude-publica-biologia',50)
) v(name,slug,position) where d.slug='biologia'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;

insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join (values
 ('mecanica','Cinemática','cinematica',10),('mecanica','Dinâmica','dinamica',20),('termologia','Calorimetria','calorimetria',10),('eletricidade','Circuitos Elétricos','circuitos-eletricos',10),('optica','Óptica Geométrica','optica-geometrica',10),
 ('quimica-geral','Estrutura Atômica','estrutura-atomica',10),('quimica-geral','Tabela Periódica','tabela-periodica',20),('fisico-quimica','Soluções','solucoes-quimica',10),('quimica-organica','Funções Orgânicas','funcoes-organicas',10),('quimica-ambiental','Poluição','poluicao-quimica',10),
 ('biologia-celular','Célula','celula',10),('genetica-evolucao','Hereditariedade','hereditariedade',10),('ecologia','Ecossistemas','ecossistemas',10),('fisiologia-humana','Sistemas do Corpo','sistemas-corpo',10),('saude-publica-biologia','Doenças e Prevenção','doencas-prevencao',10)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join (values
 ('cinematica','Movimento Uniforme','movimento-uniforme',10),('dinamica','Leis de Newton','leis-newton',10),('calorimetria','Mudanças de Estado','mudancas-estado',10),('circuitos-eletricos','Lei de Ohm','lei-ohm',10),('optica-geometrica','Espelhos e Lentes','espelhos-lentes',10),
 ('estrutura-atomica','Modelos Atômicos','modelos-atomicos',10),('tabela-periodica','Propriedades Periódicas','propriedades-periodicas',10),('solucoes-quimica','Concentração','concentracao',10),('funcoes-organicas','Hidrocarbonetos','hidrocarbonetos',10),('poluicao-quimica','Tratamento de Água','tratamento-agua',10),
 ('celula','Organelas','organelas',10),('hereditariedade','Leis de Mendel','leis-mendel',10),('ecossistemas','Cadeias Alimentares','cadeias-alimentares',10),('sistemas-corpo','Sistema Imunológico','sistema-imunologico',10),('doencas-prevencao','Imunização','imunizacao',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
