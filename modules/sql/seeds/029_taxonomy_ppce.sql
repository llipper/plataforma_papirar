-- Complementos identificados no conteúdo programático do PPCE.
-- Reutiliza assuntos existentes; só cria nós que não tinham representação.
begin;

insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d join (values
 ('raciocinio-logico','Raciocínio Verbal','raciocinio-verbal',60),
 ('raciocinio-logico','Raciocínio Matemático','raciocinio-matematico',70),
 ('raciocinio-logico','Raciocínio Sequencial','raciocinio-sequencial',80),
 ('raciocinio-logico','Orientação Espacial e Temporal','orientacao-espacial-temporal',90),
 ('legislacao-especial','Legislação Penitenciária do Ceará','legislacao-penitenciaria-ceara',60)
) v(discipline_slug,name,slug,position) on v.discipline_slug=d.slug
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;

insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join (values
 ('pacote-office-ferramentas','LibreOffice Writer','libreoffice-writer',40),
 ('pacote-office-ferramentas','LibreOffice Calc','libreoffice-calc',50),
 ('pacote-office-ferramentas','LibreOffice Impress','libreoffice-impress',60),
 ('internet-redes','Intranet e Extranet','intranet-extranet',30),
 ('internet-redes','URL, Links e Navegação','url-links-navegacao',40),
 ('internet-redes','Redes Sociais','redes-sociais',50),
 ('seguranca-informacao','Assinatura Digital','assinatura-digital',30),
 ('hardware-software','Armazenamento e Memória','armazenamento-memoria',20),
 ('hardware-software','Periféricos','perifericos',30),
 ('organizacao-administrativa','Centralização e Descentralização','centralizacao-descentralizacao',20),
 ('organizacao-administrativa','Agências Executivas e Reguladoras','agencias-executivas-reguladoras',30),
 ('politicas-publicas','Acesso à Informação','acesso-informacao',20),
 ('politicas-publicas','Proteção de Dados Pessoais','protecao-dados-pessoais',30),
 ('governanca-publica','Governança e Accountability','governanca-accountability',20),
 ('atos-administrativos','Formação e Validade','formacao-validade-atos',20),
 ('atos-administrativos','Extinção e Convalidação','extincao-convalidacao-atos',30),
 ('poderes-administracao','Poder Hierárquico e Disciplinar','poder-hierarquico-disciplinar',20),
 ('poderes-administracao','Poder Regulamentar e Abuso','poder-regulamentar-abuso',30),
 ('servicos-publicos','Delegação e Serviços Públicos','delegacao-servicos-publicos',20),
 ('responsabilidade-estado','Nexo e Excludentes','nexo-excludentes-estado',20),
 ('defesa-estado-instituicoes-democraticas','Segurança Pública','seguranca-publica-constitucional',10),
 ('ordem-social','Seguridade e Meio Ambiente','seguridade-meio-ambiente',10),
 ('direitos-fundamentais-dh','Regras de Nelson Mandela','regras-nelson-mandela',20),
 ('direitos-fundamentais-dh','Regras de Bangkok','regras-bangkok',30),
 ('tratados-responsabilidade-dh','Convenção Americana de Direitos Humanos','convencao-americana-dh',20),
 ('parte-geral-penal','Teoria Geral do Crime','teoria-geral-crime',20),
 ('crimes-especie-penal','Crimes contra a Pessoa e o Patrimônio','crimes-pessoa-patrimonio',20),
 ('crimes-especie-penal','Crimes contra a Incolumidade e a Paz Pública','crimes-incolumidade-paz',30),
 ('crimes-especie-penal','Crimes contra a Fé Pública','crimes-fe-publica',40),
 ('leis-penais-especiais','Antitortura','antitortura',20),
 ('leis-penais-especiais','Estatuto do Desarmamento','estatuto-desarmamento',30),
 ('leis-penais-especiais','Improbidade Administrativa','improbidade-administrativa',40),
 ('legislacao-penal-especial','Pacote Anticrime','pacote-anticrime',20),
 ('execucao-penal','Lei de Execução Penal','lei-execucao-penal',20),
 ('drogas-legislacao-especial','Tráfico e Crimes de Drogas','trafico-crimes-drogas',20),
 ('organizacoes-criminosas','Lei de Organizações Criminosas','lei-organizacoes-criminosas',20),
 ('abuso-autoridade','Lei de Abuso de Autoridade','lei-abuso-autoridade',20),
 ('legislacao-penitenciaria-ceara','Constituição do Estado do Ceará','constituicao-ceara-seguranca',10),
 ('legislacao-penitenciaria-ceara','Estatuto dos Servidores do Ceará','estatuto-servidores-ceara',20),
 ('legislacao-penitenciaria-ceara','Carreira e Regime Disciplinar Penal','carreira-regime-disciplinar-penal',30),
 ('legislacao-penitenciaria-ceara','Abono por Esforço Operacional','abono-esforco-operacional',40),
 ('legislacao-penitenciaria-ceara','Normas Operacionais do Sistema Prisional','normas-operacionais-sistema-prisional',50),
 ('legislacao-penitenciaria-ceara','Armamento, Visitas e PAD','armamento-visitas-pad',60),
 ('legislacao-penitenciaria-ceara','Segurança Máxima e Câmeras Corporais','seguranca-maxima-cameras',70),
 ('raciocinio-verbal','Relações Verbais','relacoes-verbais',10),
 ('raciocinio-matematico','Problemas Aritméticos','problemas-aritmeticos',10),
 ('raciocinio-sequencial','Padrões e Sequências','padroes-sequencias',10),
 ('orientacao-espacial-temporal','Orientação Espacial e Temporal','orientacao-espacial-temporal-topico',10),('gramatica','Tempos e Modos Verbais','tempos-modos-verbais',40),('gramatica','Pontuação','pontuacao-portugues',50),('gramatica','Crase e Colocação Pronominal','crase-colocacao-pronominal',60),('sintaxe','Coordenação e Subordinação','coordenacao-subordinacao',20),('principios-eticos','Ética e Cidadania','etica-cidadania',20),('principios-eticos','Ética e Moral','etica-moral',30),('conduta-servico-publico','Ética e Função Pública','etica-funcao-publica',20),('conduta-servico-publico','Ética no Setor Público','etica-setor-publico',30)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;

insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join (values
 ('libreoffice-writer','Formatação e Tabelas','formatacao-tabelas-writer',10),('libreoffice-calc','Fórmulas e Funções','formulas-funcoes-calc',10),('libreoffice-impress','Slides e Animações','slides-animacoes-impress',10),('intranet-extranet','Serviços de Rede','servicos-rede-internet',10),('url-links-navegacao','URL e Impressão de Páginas','url-impressao-paginas',10),('redes-sociais','Uso Seguro de Redes Sociais','uso-seguro-redes-sociais',10),('assinatura-digital','Autenticidade e Integridade','autenticidade-integridade',10),('armazenamento-memoria','Discos e Memórias','discos-memorias',10),('perifericos','Entrada e Saída','entrada-saida-perifericos',10),('centralizacao-descentralizacao','Concentração e Desconcentração','concentracao-desconcentracao',10),('agencias-executivas-reguladoras','Qualificação e Regulação','qualificacao-regulacao',10),('acesso-informacao','Transparência Ativa e Passiva','transparencia-ativa-passiva',10),('protecao-dados-pessoais','Bases e Direitos do Titular','bases-direitos-titular',10),('governanca-accountability','Prestação de Contas','prestacao-contas',10),('formacao-validade-atos','Elementos e Pressupostos','elementos-pressupostos-ato',10),('extincao-convalidacao-atos','Anulação e Revogação','anulacao-revogacao',10),('poder-hierarquico-disciplinar','Hierarquia e Disciplina','hierarquia-disciplina',10),('poder-regulamentar-abuso','Regulamentação e Excesso','regulamentacao-excesso',10),('delegacao-servicos-publicos','Concessão e Permissão','concessao-permissao-publica',10),('nexo-excludentes-estado','Caso Fortuito e Culpa','caso-fortuito-culpa',10),('seguranca-publica-constitucional','Órgãos de Segurança Pública','orgaos-seguranca-publica',10),('seguridade-meio-ambiente','Família Criança Adolescente e Idoso','familia-crianca-idoso',10),('regras-nelson-mandela','Tratamento de Pessoas Presas','tratamento-pessoas-presas',10),('regras-bangkok','Mulheres Privadas de Liberdade','mulheres-privadas-liberdade',10),('convencao-americana-dh','Garantias Judiciais','garantias-judiciais',10),('teoria-geral-crime','Fato Típico e Culpabilidade','fato-tipico-culpabilidade',10),('crimes-pessoa-patrimonio','Crimes contra a Pessoa','crimes-contra-pessoa',10),('crimes-incolumidade-paz','Crimes contra a Incolumidade','crimes-contra-incolumidade',10),('crimes-fe-publica','Falsidade Documental','falsidade-documental',10),('antitortura','Condutas e Penas','condutas-penas-tortura',10),('estatuto-desarmamento','Posse e Porte de Arma','posse-porte-armas',10),('improbidade-administrativa','Atos de Improbidade','atos-improbidade',10),('pacote-anticrime','Alterações Legislativas','alteracoes-pacote-anticrime',10),('lei-execucao-penal','Assistência e Regimes','assistencia-regimes-lep',10),('trafico-crimes-drogas','Tipos Penais','tipos-penais-drogas',10),('lei-organizacoes-criminosas','Investigação e Colaboração','investigacao-colaboracao',10),('lei-abuso-autoridade','Abuso e Responsabilização','abuso-responsabilizacao',10),('constituicao-ceara-seguranca','Segurança e Defesa Civil','seguranca-defesa-civil-ceara',10),('estatuto-servidores-ceara','Direitos e Deveres','direitos-deveres-servidores-ceara',10),('carreira-regime-disciplinar-penal','Regime Disciplinar','regime-disciplinar-penal-ceara',10),('abono-esforco-operacional','Hipóteses e Regulamentação','hipoteses-abono-operacional',10),('normas-operacionais-sistema-prisional','Procedimentos Operacionais','procedimentos-operacionais-prisional',10),('armamento-visitas-pad','Processo Administrativo Disciplinar','processo-disciplinar-prisional',10),('seguranca-maxima-cameras','Unidade de Segurança Máxima','unidade-seguranca-maxima',10),('relacoes-verbais','Analogia e Classificação','analogia-classificacao-verbal',10),('problemas-aritmeticos','Operações e Proporções','operacoes-proporcoes',10),('padroes-sequencias','Sequências Numéricas e Figurais','sequencias-numericas-figurais',10),('orientacao-espacial-temporal-topico','Posição e Ordem Temporal','posicao-ordem-temporal',10),('tempos-modos-verbais','Correlação Verbal','correlacao-verbal',10),('pontuacao-portugues','Vírgula e Período','virgula-periodo',10),('crase-colocacao-pronominal','Pronomes Átonos','pronomes-atonos',10),('coordenacao-subordinacao','Orações Coordenadas e Subordinadas','oracoes-coordenadas-subordinadas',10),('etica-cidadania','Cidadania e Interesse Público','cidadania-interesse-publico',10),('etica-moral','Diferenças entre Ética e Moral','diferencas-etica-moral',10),('etica-funcao-publica','Dever Ético','dever-etico-funcao-publica',10),('etica-setor-publico','Valores Institucionais','valores-institucionais',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
