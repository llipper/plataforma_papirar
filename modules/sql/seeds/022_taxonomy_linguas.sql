-- Língua Inglesa e Língua Espanhola.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Leitura e Interpretação','leitura-interpretacao',10),('Vocabulário','vocabulario',20),('Gramática','gramatica-lingua',30),('Conectores e Coesão','conectores-coesao-lingua',40)
) v(name,slug,position) where d.slug in ('lingua-inglesa','lingua-espanhola')
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug || '-' || d.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('leitura-interpretacao','Skimming e Scanning','skimming-scanning',10),('leitura-interpretacao','Inferência Textual','inferencia-textual',20),('vocabulario','Falsos Cognatos','falsos-cognatos',10),('vocabulario','Contexto e Significado','contexto-significado',20),('gramatica-lingua','Tempos Verbais','tempos-verbais',10),('gramatica-lingua','Pronomes e Artigos','pronomes-artigos',20),('conectores-coesao-lingua','Conectores','conectores',10),('conectores-coesao-lingua','Referência Textual','referencia-textual',20)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug in ('lingua-inglesa','lingua-espanhola')
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug || '-' || d.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('skimming-scanning','Ideia Principal','ideia-principal',10),('skimming-scanning','Palavras Cognatas','palavras-cognatas',20),('falsos-cognatos','Expressões Idiomáticas','expressoes-idiomaticas',10),('tempos-verbais','Vozes Verbais','vozes-verbais-lingua',10),('conectores','Conjunções','conjuncoes-lingua',10)
) v(topic_slug,name,slug,position) on v.topic_slug || '-' || d.slug = t.slug where d.slug in ('lingua-inglesa','lingua-espanhola')
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
