-- Direito Processual Penal Militar.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Princípios e Competência','principios-competencia',10),('Polícia Judiciária Militar','policia-judiciaria-militar',20),('Inquérito Policial Militar','inquerito-policial-militar',30),('Processo e Julgamento','processo-julgamento-militar',40),('Recursos','recursos-processo-militar',50)
) v(name,slug,position) where d.slug='direito-processual-penal-militar'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('principios-competencia','Aplicação da Lei Processual','aplicacao-lei-processual-militar',10),('principios-competencia','Competência da Justiça Militar','competencia-justica-militar',20),('policia-judiciaria-militar','Autoridade Policial Militar','autoridade-policial-militar',10),('inquerito-policial-militar',' instauração e Diligências','instauracao-diligencias-ipm',10),('processo-julgamento-militar','Ação Penal Militar','acao-penal-militar',10),('processo-julgamento-militar','Provas','provas-processo-militar',20),('recursos-processo-militar','Recursos em Espécie','recursos-especie-militar',10)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug='direito-processual-penal-militar'
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('aplicacao-lei-processual-militar','Lei Processual no Tempo','lei-processual-tempo-militar',10),('competencia-justica-militar','Justiça Militar da União e Estadual','justica-militar-uniao-estadual',10),('autoridade-policial-militar','Atribuições do Encarregado','atribuicoes-encarregado',10),('instauracao-diligencias-ipm','Prisão e Busca','prisao-busca-ipm',10),('acao-penal-militar','Denúncia e Recebimento','denuncia-recebimento-militar',10),('provas-processo-militar','Prova Testemunhal','prova-testemunhal-militar',10),('recursos-especie-militar','Apelação e Recurso em Sentido Estrito','apelacao-rse-militar',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug='direito-processual-penal-militar'
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
