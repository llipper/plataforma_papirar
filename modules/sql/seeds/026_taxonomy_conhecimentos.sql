-- Conhecimentos gerais e regionais, mantidos separados para permitir filtros por edital.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Atualidades','atualidades-gerais',10),('Brasil','brasil-conhecimentos-gerais',20),('Mundo','mundo-conhecimentos-gerais',30),('Cidadania','cidadania-conhecimentos-gerais',40)
) v(name,slug,position) where d.slug='conhecimentos-gerais'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('História Regional','historia-regional',10),('Geografia Regional','geografia-regional',20),('Administração Pública Regional','administracao-publica-regional',30),('Cultura e Sociedade Regional','cultura-sociedade-regional',40)
) v(name,slug,position) where d.slug='conhecimentos-regionais'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join (values
 ('atualidades-gerais','Política e Sociedade','politica-sociedade-atualidades',10),('atualidades-gerais','Economia e Tecnologia','economia-tecnologia-atualidades',20),('brasil-conhecimentos-gerais','Formação do Estado Brasileiro','formacao-estado-brasileiro',10),('mundo-conhecimentos-gerais','Relações Internacionais','relacoes-internacionais',10),('cidadania-conhecimentos-gerais','Direitos e Deveres','direitos-deveres-cidadania',10),
 ('historia-regional','Formação Histórica','formacao-historica-regional',10),('geografia-regional','Território e População','territorio-populacao-regional',10),('administracao-publica-regional','Organização Administrativa','organizacao-administrativa-regional',10),('cultura-sociedade-regional','Identidade Cultural','identidade-cultural-regional',10)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join (values
 ('politica-sociedade-atualidades','Instituições Brasileiras','instituicoes-brasileiras',10),('economia-tecnologia-atualidades','Inovação e Transformação Digital','inovacao-transformacao-digital',10),('formacao-estado-brasileiro','Constituição e República','constituicao-republica',10),('relacoes-internacionais','Organizações Internacionais','organizacoes-internacionais',10),('direitos-deveres-cidadania','Participação Social','participacao-social',10),('formacao-historica-regional','Ciclos Econômicos Regionais','ciclos-economicos-regionais',10),('territorio-populacao-regional','Divisão Territorial','divisao-territorial-regional',10),('organizacao-administrativa-regional','Serviços Públicos','servicos-publicos-regionais',10),('identidade-cultural-regional','Patrimônio Cultural','patrimonio-cultural-regional',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
