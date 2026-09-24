-- Informática: assuntos, tópicos e subtópicos.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Sistemas Operacionais','sistemas-operacionais',10),('Pacote Office e Ferramentas','pacote-office-ferramentas',20),
 ('Internet e Redes','internet-redes',30),('Segurança da Informação','seguranca-informacao',40),('Hardware e Software','hardware-software',50)
) v(name,slug,position) where d.slug='informatica'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('sistemas-operacionais','Windows','windows',10),('sistemas-operacionais','Linux','linux',20),('pacote-office-ferramentas','Editor de Texto','editor-texto',10),
 ('pacote-office-ferramentas','Planilhas','planilhas',20),('pacote-office-ferramentas','Apresentações','apresentacoes',30),('internet-redes','Navegadores e Busca','navegadores-busca',10),
 ('internet-redes','Protocolos e Serviços','protocolos-servicos',20),('seguranca-informacao','Princípios de Segurança','principios-seguranca',10),
 ('seguranca-informacao','Ameaças e Proteção','ameacas-protecao',20),('hardware-software','Componentes','componentes',10)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='informatica'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('windows','Arquivos e Pastas','arquivos-pastas',10),('windows','Configurações e Atalhos','configuracoes-atalhos',20),('linux','Comandos Básicos','comandos-basicos',10),
 ('editor-texto','Formatação','formatacao',10),('editor-texto','Revisão e Impressão','revisao-impressao',20),('planilhas','Fórmulas','formulas',10),
 ('planilhas','Funções','funcoes-planilhas',20),('navegadores-busca','Pesquisa na Web','pesquisa-web',10),('protocolos-servicos','HTTP e HTTPS','http-https',10),
 ('principios-seguranca','Confidencialidade, Integridade e Disponibilidade','cid',10),('ameacas-protecao','Malware','malware',10),('componentes','Memória e Armazenamento','memoria-armazenamento',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='informatica'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
