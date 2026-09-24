-- Segurança Pública.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Sistema de Segurança Pública','sistema-seguranca-publica',10),('Políticas Públicas de Segurança','politicas-publicas-seguranca',20),('Atividade Policial','atividade-policial',30),('Direitos Humanos e Cidadania','direitos-humanos-cidadania',40),('Gestão de Crises','gestao-crises',50)
) v(name,slug,position) where d.slug='seguranca-publica'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('sistema-seguranca-publica','Órgãos de Segurança','orgaos-seguranca',10),('sistema-seguranca-publica','SUSP','susp',20),('politicas-publicas-seguranca','Prevenção e Repressão','prevencao-repressao',10),('atividade-policial','Poder de Polícia','poder-policia',10),('atividade-policial','Uso da Força','uso-forca',20),('direitos-humanos-cidadania','Cidadania e Diversidade','cidadania-diversidade',10),('gestao-crises','Gerenciamento de Crises','gerenciamento-crises',10)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='seguranca-publica'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('orgaos-seguranca','Polícias e Forças Armadas','policias-forcas-armadas',10),('susp','Integração Institucional','integracao-institucional',10),('prevencao-repressao','Policiamento Preventivo','policiamento-preventivo',10),('poder-policia','Atributos e Limites','atributos-limites-poder-policia',10),('uso-forca','Princípios da Atuação','principios-uso-forca',10),('cidadania-diversidade','Grupos Vulneráveis','grupos-vulneraveis',10),('gerenciamento-crises','Negociação e Mediação','negociacao-mediacao',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='seguranca-publica'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
