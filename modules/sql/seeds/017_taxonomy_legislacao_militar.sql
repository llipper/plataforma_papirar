-- Legislação Militar e regulamentos institucionais.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Organização Militar','organizacao-militar',10),('Estatuto dos Militares','estatuto-militares',20),('Regulamentos Disciplinares','regulamentos-disciplinares',30),('Legislação Institucional','legislacao-institucional-militar',40),('Direito Administrativo Militar','direito-administrativo-militar',50)
) v(name,slug,position) where d.slug='legislacao-militar'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('organizacao-militar','Hierarquia e Disciplina','hierarquia-disciplina',10),('estatuto-militares','Direitos e Deveres','direitos-deveres-militares',10),('estatuto-militares','Carreira e Ingresso','carreira-ingresso-militar',20),('regulamentos-disciplinares','Transgressões Disciplinares','transgressoes-disciplinares',10),('regulamentos-disciplinares','Sanções','sancoes-disciplinares',20),('legislacao-institucional-militar','Regulamento da Corporação','regulamento-corporacao',10),('direito-administrativo-militar','Atos e Poderes','atos-poderes-militares',10)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='legislacao-militar'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('hierarquia-disciplina','Postos e Graduações','postos-graduacoes',10),('direitos-deveres-militares','Dever de Obediência','dever-obediencia',10),('carreira-ingresso-militar','Requisitos de Ingresso','requisitos-ingresso-militar',10),('transgressoes-disciplinares','Classificação das Transgressões','classificacao-transgressoes',10),('sancoes-disciplinares','Apuração e Defesa','apuracao-defesa-disciplinar',10),('regulamento-corporacao','Organização da Polícia Militar','organizacao-policia-militar',10),('atos-poderes-militares','Poder Disciplinar','poder-disciplinar-militar',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='legislacao-militar'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
