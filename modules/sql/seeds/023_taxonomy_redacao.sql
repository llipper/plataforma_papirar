-- Redação, separada de Redação Oficial.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Planejamento Textual','planejamento-textual',10),('Dissertação','dissertacao',20),('Argumentação','argumentacao',30),('Coesão e Coerência','coesao-coerencia-redacao',40),('Revisão Textual','revisao-textual',50)
) v(name,slug,position) where d.slug='redacao'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('planejamento-textual','Tema e Projeto','tema-projeto',10),('dissertacao','Introdução','introducao-redacao',10),('dissertacao','Desenvolvimento','desenvolvimento-redacao',20),('dissertacao','Conclusão','conclusao-redacao',30),('argumentacao','Tipos de Argumento','tipos-argumento',10),('coesao-coerencia-redacao','Mecanismos de Coesão','mecanismos-coesao-redacao',10),('revisao-textual','Adequação Linguística','adequacao-linguistica',10)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='redacao'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('tema-projeto','Delimitação do Tema','delimitacao-tema',10),('introducao-redacao','Contextualização','contextualizacao-redacao',10),('desenvolvimento-redacao','Tópico Frasal','topico-frasal',10),('conclusao-redacao','Proposta de Intervenção','proposta-intervencao',10),('tipos-argumento','Argumento de Autoridade','argumento-autoridade',10),('mecanismos-coesao-redacao','Conectivos','conectivos-redacao',10),('adequacao-linguistica','Norma-Padrão','norma-padrao-redacao',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='redacao'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
