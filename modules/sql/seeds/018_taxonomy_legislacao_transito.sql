-- Legislação de Trânsito para PRF e carreiras relacionadas.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Código de Trânsito Brasileiro','codigo-transito-brasileiro',10),('Sistema Nacional de Trânsito','sistema-nacional-transito',20),('Normas de Circulação','normas-circulacao',30),('Infrações e Penalidades','infracoes-penalidades-transito',40),('Crimes de Trânsito','crimes-transito',50),('Processo Administrativo de Trânsito','processo-administrativo-transito',60)
) v(name,slug,position) where d.slug='legislacao-transito'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('codigo-transito-brasileiro','Disposições Preliminares','disposicoes-preliminares-ctb',10),('sistema-nacional-transito','Órgãos e Competências','orgaos-competencias-transito',10),('normas-circulacao','Regras de Circulação','regras-circulacao',10),('normas-circulacao','Sinalização','sinalizacao-transito',20),('infracoes-penalidades-transito','Infrações','infracoes-ctb',10),('infracoes-penalidades-transito','Penalidades e Medidas','penalidades-medidas-transito',20),('crimes-transito','Crimes em Espécie','crimes-especie-transito',10),('processo-administrativo-transito','Auto de Infração','auto-infracao',10)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='legislacao-transito'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('disposicoes-preliminares-ctb','Conceitos e Definições','conceitos-definicoes-ctb',10),('orgaos-competencias-transito','Competências do CONTRAN','competencias-contran',10),('regras-circulacao','Preferência e Ultrapassagem','preferencia-ultrapassagem',10),('sinalizacao-transito','Sinalização Vertical e Horizontal','sinalizacao-vertical-horizontal',10),('infracoes-ctb','Classificação das Infrações','classificacao-infracoes-ctb',10),('penalidades-medidas-transito','Suspensão e Cassação','suspensao-cassacao',10),('crimes-especie-transito','Embriaguez ao Volante','embriaguez-volante',10),('auto-infracao','Defesa e Recursos','defesa-recursos-transito',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='legislacao-transito'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
