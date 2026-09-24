-- Tecnologia da Informação: fundamentos cobrados em carreiras policiais.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Governança e Gestão de TI','governanca-gestao-ti',10),('Banco de Dados','banco-dados',20),('Desenvolvimento de Sistemas','desenvolvimento-sistemas',30),('Redes de Computadores','redes-computadores',40),('Dados e Nuvem','dados-nuvem',50)
) v(name,slug,position) where d.slug='tecnologia-informacao'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('governanca-gestao-ti','Governança','governanca',10),('governanca-gestao-ti','Gestão de Serviços','gestao-servicos',20),('banco-dados','Modelo Relacional','modelo-relacional',10),('banco-dados','SQL','sql',20),('desenvolvimento-sistemas','Engenharia de Software','engenharia-software',10),('desenvolvimento-sistemas','APIs','apis',20),('redes-computadores','Arquitetura de Redes','arquitetura-redes',10),('redes-computadores','TCP/IP','tcp-ip',20),('dados-nuvem','Nuvem','nuvem',10),('dados-nuvem','Backup e Continuidade','backup-continuidade',20)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='tecnologia-informacao'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('governanca','COBIT e ITIL','cobit-itil',10),('gestao-servicos','Incidentes e Mudanças','incidentes-mudancas',10),('modelo-relacional','Chaves e Restrições','chaves-restricoes',10),('sql','Consultas e Índices','consultas-indices',10),('engenharia-software','Ciclo de Vida','ciclo-vida',10),('apis','REST e Autenticação','rest-autenticacao',10),('arquitetura-redes','LAN, WAN e VPN','lan-wan-vpn',10),('tcp-ip','IPv4 e IPv6','ipv4-ipv6',10),('nuvem','IaaS, PaaS e SaaS','iaas-paas-saas',10),('backup-continuidade','RPO e RTO','rpo-rto',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='tecnologia-informacao'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
