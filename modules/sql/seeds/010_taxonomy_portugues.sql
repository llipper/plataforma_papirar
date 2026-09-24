-- Língua Portuguesa: assuntos, tópicos e subtópicos para concursos.
begin;

insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Interpretação de Textos','interpretacao-textos',10),('Gramática','gramatica',20),
 ('Morfologia','morfologia',30),('Sintaxe','sintaxe',40),('Semântica','semantica',50),
 ('Ortografia e Acentuação','ortografia-acentuacao',60),('Redação e Reescrita','redacao-reescrita',70)
) v(name,slug,position) where d.slug='portugues'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;

insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id
join (values
 ('interpretacao-textos','Compreensão Global','compreensao-global',10),('interpretacao-textos','Inferência e Implícitos','inferencia-implicitos',20),
 ('interpretacao-textos','Tipologia e Gêneros','tipologia-generos',30),('gramatica','Classes de Palavras','classes-palavras',10),
 ('gramatica','Concordância','concordancia',20),('gramatica','Regência e Crase','regencia-crase',30),
 ('morfologia','Estrutura das Palavras','estrutura-palavras',10),('morfologia','Formação de Palavras','formacao-palavras',20),
 ('sintaxe','Termos da Oração','termos-oracao',10),('sintaxe','Período Composto','periodo-composto',20),
 ('sintaxe','Pontuação','pontuacao',30),('semantica','Significação','significacao',10),
 ('semantica','Coesão e Coerência','coesao-coerencia',20),('ortografia-acentuacao','Acentuação','acentuacao',10),
 ('ortografia-acentuacao','Ortografia Oficial','ortografia-oficial',20),('redacao-reescrita','Reescrita','reescrita',10),
 ('redacao-reescrita','Correspondência Oficial','correspondencia-oficial',20)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='portugues'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;

insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id
join (values
 ('compreensao-global','Tema e Tese','tema-tese',10),('compreensao-global','Ideias Principais','ideias-principais',20),
 ('inferencia-implicitos','Pressupostos','pressupostos',10),('inferencia-implicitos','Ironia e Efeitos de Sentido','ironia-efeitos-sentido',20),
 ('tipologia-generos','Tipologia Textual','tipologia-textual',10),('tipologia-generos','Gêneros Discursivos','generos-discursivos',20),
 ('classes-palavras','Pronomes','pronomes',10),('classes-palavras','Conjunções','conjuncoes',20),
 ('concordancia','Concordância Verbal','concordancia-verbal',10),('concordancia','Concordância Nominal','concordancia-nominal',20),
 ('regencia-crase','Regência Verbal','regencia-verbal',10),('regencia-crase','Uso da Crase','uso-crase',20),
 ('periodo-composto','Coordenação','coordenacao',10),('periodo-composto','Subordinação','subordinacao',20),
 ('pontuacao','Vírgula','virgula',10),('pontuacao','Dois-Pontos e Ponto e Vírgula','dois-pontos-ponto-virgula',20),
 ('coesao-coerencia','Referenciação','referenciacao',10),('coesao-coerencia','Conectores','conectores',20),
 ('acentuacao','Regras Gerais','regras-gerais',10),('acentuacao','Acentuação Verbal','acentuacao-verbal',20),
 ('ortografia-oficial','Emprego de Letras','emprego-letras',10),('ortografia-oficial','Hífen','hifen',20),
 ('reescrita','Substituição de Trechos','substituicao-trechos',10),('reescrita','Correção Gramatical','correcao-gramatical',20),
 ('correspondencia-oficial','Padrão Ofício','padrao-oficio',10),('correspondencia-oficial','Pronomes de Tratamento','pronomes-tratamento',20)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='portugues'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;

commit;
