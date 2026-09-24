-- Matemática: assuntos, tópicos e subtópicos para concursos.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Aritmética','aritmetica',10),('Álgebra','algebra',20),('Razão e Proporção','razao-proporcao',30),
 ('Porcentagem e Matemática Financeira','porcentagem-matematica-financeira',40),('Geometria','geometria',50),('Estatística Básica','estatistica-basica',60)
) v(name,slug,position) where d.slug='matematica'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('aritmetica','Números e Operações','numeros-operacoes',10),('aritmetica','Divisibilidade','divisibilidade',20),
 ('algebra','Equações','equacoes',10),('algebra','Funções','funcoes',20),('razao-proporcao','Regra de Três','regra-tres',10),
 ('razao-proporcao','Grandezas','grandezas',20),('porcentagem-matematica-financeira','Porcentagem','porcentagem',10),
 ('porcentagem-matematica-financeira','Juros','juros',20),('geometria','Geometria Plana','geometria-plana',10),
 ('geometria','Geometria Espacial','geometria-espacial',20),('estatistica-basica','Medidas de Tendência Central','medidas-tendencia-central',10),
 ('estatistica-basica','Gráficos e Tabelas','graficos-tabelas',20)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='matematica'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('numeros-operacoes','Frações','fracoes',10),('numeros-operacoes','Potenciação e Radiciação','potenciacao-radiciacao',20),
 ('divisibilidade','MDC e MMC','mdc-mmc',10),('divisibilidade','Números Primos','numeros-primos',20),
 ('equacoes','Equação do Primeiro Grau','equacao-primeiro-grau',10),('equacoes','Sistemas Lineares','sistemas-lineares',20),
 ('funcoes','Função Afim','funcao-afim',10),('funcoes','Função Quadrática','funcao-quadratica',20),
 ('regra-tres','Regra de Três Simples','regra-tres-simples',10),('regra-tres','Regra de Três Composta','regra-tres-composta',20),
 ('porcentagem','Aumentos e Descontos','aumentos-descontos',10),('juros','Juros Simples','juros-simples',10),('juros','Juros Compostos','juros-compostos',20),
 ('geometria-plana','Áreas','areas',10),('geometria-plana','Perímetros','perimetros',20),('geometria-espacial','Volumes','volumes',10),
 ('medidas-tendencia-central','Média, Mediana e Moda','media-mediana-moda',10),('graficos-tabelas','Leitura de Gráficos','leitura-graficos',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='matematica'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
