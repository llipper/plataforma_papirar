-- Criminologia.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Fundamentos da Criminologia','fundamentos-criminologia',10),('Teorias Criminológicas','teorias-criminologicas',20),('Vitimologia','vitimologia',30),('Política Criminal','politica-criminal',40),('Criminalidade e Controle Social','criminalidade-controle-social',50)
) v(name,slug,position) where d.slug='criminologia'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('fundamentos-criminologia','Objeto e Método','objeto-metodo-criminologia',10),('fundamentos-criminologia','Escolas Criminológicas','escolas-criminologicas',20),('teorias-criminologicas','Teorias Sociológicas','teorias-sociologicas-crime',10),('teorias-criminologicas','Teorias Biopsicológicas','teorias-biopsicologicas',20),('vitimologia','Vítima e Vitimização','vitima-vitimizacao',10),('politica-criminal','Prevenção do Crime','prevencao-crime',10),('criminalidade-controle-social','Controle Formal e Informal','controle-formal-informal',10)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='criminologia'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('objeto-metodo-criminologia','Criminologia Empírica','criminologia-empirica',10),('escolas-criminologicas','Escola Clássica','escola-classica',10),('teorias-sociologicas-crime','Anomia e Aprendizagem','anomia-aprendizagem',10),('teorias-biopsicologicas','Criminologia Clínica','criminologia-clinica',10),('vitima-vitimizacao','Vitimização Primária e Secundária','vitimizacao-primaria-secundaria',10),('prevencao-crime','Prevenção Primária e Secundária','prevencao-primaria-secundaria',10),('controle-formal-informal','Polícia e Justiça Criminal','policia-justica-criminal',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='criminologia'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
