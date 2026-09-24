-- Direito Penal Militar.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Parte Geral','parte-geral',10),('Crimes Militares em Tempo de Paz','crimes-tempo-paz',20),('Crimes Militares em Tempo de Guerra','crimes-tempo-guerra',30),('Penas e Medidas','penas-medidas',40)
) v(name,slug,position) where d.slug='direito-penal-militar'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('parte-geral','Aplicação da Lei Penal Militar','aplicacao-lei-penal-militar',10),('parte-geral','Teoria do Crime Militar','teoria-crime-militar',20),('crimes-tempo-paz','Crimes Contra a Administração Militar','crimes-administracao-militar',10),('crimes-tempo-paz','Crimes Contra o Serviço Militar','crimes-servico-militar',20),('crimes-tempo-guerra','Crimes de Guerra','crimes-guerra',10),('penas-medidas','Penas','penas',10),('penas-medidas','Concurso de Crimes','concurso-crimes',20)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='direito-penal-militar'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('aplicacao-lei-penal-militar','Tempo e Lugar do Crime','tempo-lugar-crime',10),('teoria-crime-militar','Dolo e Culpa','dolo-culpa-militar',10),('crimes-administracao-militar','Peculato e Concussão','peculato-concussao-militar',10),('crimes-servico-militar','Deserção','desercao',10),('crimes-guerra','Hostilidade Contra o Inimigo','hostilidade-inimigo',10),('penas','Espécies de Pena','especies-pena-militar',10),('concurso-crimes','Concurso Material e Formal','concurso-material-formal-militar',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='direito-penal-militar'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
