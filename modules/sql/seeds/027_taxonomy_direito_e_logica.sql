-- Completa as áreas centrais já existentes no catálogo, sem substituir a taxonomia constitucional.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Parte Geral','parte-geral-penal',10),('Crimes em Espécie','crimes-especie-penal',20),('Legislação Penal Especial','legislacao-penal-especial',30),('Execução Penal','execucao-penal',40)
) v(name,slug,position) where d.slug='direito-penal'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Inquérito e Ação Penal','inquerito-acao-penal',10),('Provas','provas-processo-penal',20),('Procedimentos','procedimentos-processo-penal',30),('Recursos','recursos-processo-penal',40)
) v(name,slug,position) where d.slug='direito-processual-penal'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Atos Administrativos','atos-administrativos',10),('Poderes da Administração','poderes-administracao',20),('Agentes Públicos','agentes-publicos',30),('Serviços Públicos','servicos-publicos',40),('Licitações e Contratos','licitacoes-contratos',50),('Responsabilidade Civil do Estado','responsabilidade-estado',60)
) v(name,slug,position) where d.slug='direito-administrativo'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Teoria Geral','teoria-geral-direitos-humanos',10),('Sistemas de Proteção','sistemas-protecao-direitos-humanos',20),('Direitos Fundamentais','direitos-fundamentais-dh',30),('Tratados e Responsabilidade','tratados-responsabilidade-dh',40)
) v(name,slug,position) where d.slug='direitos-humanos'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Leis Penais Especiais','leis-penais-especiais',10),('Abuso de Autoridade','abuso-autoridade',20),('Drogas','drogas-legislacao-especial',30),('Organizações Criminosas','organizacoes-criminosas',40),('Desarmamento','desarmamento',50)
) v(name,slug,position) where d.slug='legislacao-especial'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Proposições e Conectivos','proposicoes-conectivos',10),('Tabelas-Verdade','tabelas-verdade',20),('Equivalências e Negações','equivalencias-negacoes',30),('Argumentação','argumentacao-logica',40),('Conjuntos e Probabilidade','conjuntos-probabilidade',50)
) v(name,slug,position) where d.slug='raciocinio-logico'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;

insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join (values
 ('parte-geral-penal','Aplicação da Lei Penal','aplicacao-lei-penal',10),('crimes-especie-penal','Crimes contra a Administração','crimes-administracao-penal',10),('legislacao-penal-especial','Crimes Hediondos','crimes-hediondos',10),('execucao-penal','Regimes de Cumprimento','regimes-cumprimento',10),
 ('inquerito-acao-penal','Ação Penal','acao-penal',10),('provas-processo-penal','Teoria da Prova','teoria-prova-penal',10),('procedimentos-processo-penal','Procedimento Comum','procedimento-comum-penal',10),('recursos-processo-penal','Recursos em Espécie','recursos-especie-penal',10),
 ('atos-administrativos','Elementos e Atributos','elementos-atributos-atos',10),('poderes-administracao','Poder de Polícia','poder-policia',10),('agentes-publicos','Regime Jurídico','regime-juridico-agentes',10),('servicos-publicos','Delegação','delegacao-servicos',10),('licitacoes-contratos','Contratação Direta','contratacao-direta',10),('responsabilidade-estado','Responsabilidade Objetiva','responsabilidade-objetiva',10),
 ('teoria-geral-direitos-humanos','Universalidade e Indivisibilidade','universalidade-indivisibilidade',10),('sistemas-protecao-direitos-humanos','Sistema Interamericano','sistema-interamericano',10),('direitos-fundamentais-dh','Direitos Individuais','direitos-individuais-dh',10),('tratados-responsabilidade-dh','Incorporação de Tratados','incorporacao-tratados',10),
 ('leis-penais-especiais','Crimes de Tortura','crimes-tortura',10),('abuso-autoridade','Tipos e Sanções','tipos-sancoes-abuso',10),('drogas-legislacao-especial','Sistema Nacional de Políticas sobre Drogas','sisnad',10),('organizacoes-criminosas','Colaboração Premiada','colaboracao-premiada',10),('desarmamento','Registro e Porte','registro-porte',10),
 ('proposicoes-conectivos','Linguagem Proposicional','linguagem-proposicional',10),('tabelas-verdade','Construção de Tabelas','construcao-tabelas',10),('equivalencias-negacoes','Leis de De Morgan','leis-de-morgan',10),('argumentacao-logica','Validade de Argumentos','validade-argumentos',10),('conjuntos-probabilidade','Operações com Conjuntos','operacoes-conjuntos',10)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join (values
 ('aplicacao-lei-penal','Tempo e Lugar do Crime','tempo-lugar-crime',10),('crimes-administracao-penal','Peculato','peculato',10),('crimes-hediondos','Rol Legal','rol-crimes-hediondos',10),('regimes-cumprimento','Progressão de Regime','progressao-regime',10),
 ('acao-penal','Condições da Ação','condicoes-acao-penal',10),('teoria-prova-penal','Cadeia de Custódia','cadeia-custodia',10),('procedimento-comum-penal','Resposta à Acusação','resposta-acusacao',10),('recursos-especie-penal','Apelação','apelacao-penal',10),
 ('elementos-atributos-atos','Motivo e Objeto','motivo-objeto-ato',10),('poder-policia','Limites do Poder de Polícia','limites-poder-policia',10),('regime-juridico-agentes','Provimento e Vacância','provimento-vacancia',10),('delegacao-servicos','Concessão e Permissão','concessao-permissao',10),('contratacao-direta','Dispensa e Inexigibilidade','dispensa-inexigibilidade',10),('responsabilidade-objetiva','Excludentes','excludentes-responsabilidade',10),
 ('universalidade-indivisibilidade','Dignidade da Pessoa Humana','dignidade-pessoa',10),('sistema-interamericano','Comissão e Corte IDH','comissao-corte-idh',10),('direitos-individuais-dh','Liberdade e Igualdade','liberdade-igualdade',10),('incorporacao-tratados','Status Normativo','status-tratados',10),
 ('crimes-tortura','Sujeitos e Condutas','sujeitos-condutas-tortura',10),('tipos-sancoes-abuso','Efeitos da Condenação','efeitos-condenacao-abuso',10),('sisnad','Prevenção e Repressão','prevencao-repressao-drogas',10),('colaboracao-premiada','Requisitos e Benefícios','requisitos-beneficios-colaboracao',10),('registro-porte','Posse e Porte','posse-porte',10),
 ('linguagem-proposicional','Proposições Simples e Compostas','proposicoes-simples-compostas',10),('construcao-tabelas','Número de Linhas','numero-linhas-tabela',10),('leis-de-morgan','Negação de Conjunção e Disjunção','negacao-conjuncao-disjuncao',10),('validade-argumentos','Premissas e Conclusão','premissas-conclusao',10),('operacoes-conjuntos','União e Interseção','uniao-intersecao',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
