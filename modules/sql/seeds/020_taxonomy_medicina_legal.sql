-- Medicina Legal.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Traumatologia Forense','traumatologia-forense',10),('Tanatologia','tanatologia',20),('Sexologia Forense','sexologia-forense',30),('Asfixiologia','asfixiologia',40),('Identificação Humana','identificacao-humana',50),('Perícias Médico-Legais','pericias-medico-legais',60)
) v(name,slug,position) where d.slug='medicina-legal'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('traumatologia-forense','Lesões e Instrumentos','lesoes-instrumentos',10),('tanatologia','Morte e Fenômenos Cadavéricos','morte-fenomenos-cadavericos',10),('sexologia-forense','Crimes Sexuais','crimes-sexuais-medicina',10),('asfixiologia','Asfixias Mecânicas','asfixias-mecanicas',10),('identificacao-humana','Identificação por Impressões','identificacao-impressoes',10),('pericias-medico-legais','Laudos e Exames','laudos-exames-medico-legais',10)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='medicina-legal'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('lesoes-instrumentos','Energias Mecânicas','energias-mecanicas',10),('morte-fenomenos-cadavericos','Sinais de Morte','sinais-morte',10),('crimes-sexuais-medicina','Exame de Corpo de Delito','exame-corpo-delito-sexual',10),('asfixias-mecanicas','Enforcamento e Estrangulamento','enforcamento-estrangulamento',10),('identificacao-impressoes','Papiloscopia','papiloscopia',10),('laudos-exames-medico-legais','Perícia e Cadeia de Custódia','pericia-cadeia-custodia',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='medicina-legal'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
