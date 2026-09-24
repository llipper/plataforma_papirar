-- Segurança Cibernética: fundamentos e resposta a incidentes.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Fundamentos de Segurança','fundamentos-seguranca',10),('Criptografia','criptografia',20),('Ataques e Vulnerabilidades','ataques-vulnerabilidades',30),('Forense Digital','forense-digital',40),('Governança e Privacidade','governanca-privacidade',50)
) v(name,slug,position) where d.slug='seguranca-cibernetica'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('fundamentos-seguranca','Controles de Acesso','controles-acesso',10),('fundamentos-seguranca','Gestão de Riscos','gestao-riscos',20),('criptografia','Criptografia Simétrica','criptografia-simetrica',10),('criptografia','Criptografia Assimétrica','criptografia-assimetrica',20),('ataques-vulnerabilidades','Malware e Engenharia Social','malware-engenharia-social',10),('ataques-vulnerabilidades','Vulnerabilidades Web','vulnerabilidades-web',20),('forense-digital','Evidências Digitais','evidencias-digitais',10),('forense-digital','Cadeia de Custódia','cadeia-custodia',20),('governanca-privacidade','LGPD','lgpd',10),('governanca-privacidade','Continuidade e Incidentes','continuidade-incidentes',20)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='seguranca-cibernetica'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('controles-acesso','Autenticação e Autorização','autenticacao-autorizacao',10),('gestao-riscos','Ameaças e Impactos','ameacas-impactos',10),('criptografia-simetrica','AES e Cifras de Bloco','aes-cifras-bloco',10),('criptografia-assimetrica','RSA e Assinatura Digital','rsa-assinatura-digital',10),('malware-engenharia-social','Phishing','phishing',10),('vulnerabilidades-web','OWASP','owasp',10),('evidencias-digitais','Coleta e Preservação','coleta-preservacao',10),('cadeia-custodia','Integridade da Evidência','integridade-evidencia',10),('lgpd','Princípios e Bases Legais','principios-bases-legais',10),('continuidade-incidentes','Resposta a Incidentes','resposta-incidentes',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='seguranca-cibernetica'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
