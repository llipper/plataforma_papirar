-- História, Geografia, Filosofia e Sociologia.
begin;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values
 ('Brasil','brasil-historia',10),('Mundo Contemporâneo','mundo-contemporaneo-historia',20),('Geopolítica','geopolitica-geografia',10),('Espaço Brasileiro','espaco-brasileiro',20),('Sociedade e Estado','sociedade-estado-sociologia',10),('Pensamento Social','pensamento-social-filosofia',20)
) v(name,slug,position) where d.slug='historia'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values ('Geopolítica','geopolitica-geografia',10),('Espaço Brasileiro','espaco-brasileiro',20),('Meio Ambiente','meio-ambiente-geografia',30)) v(name,slug,position) where d.slug='geografia'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values ('Ética','etica-filosofia',10),('Filosofia Política','filosofia-politica',20),('Teoria do Conhecimento','teoria-conhecimento',30)) v(name,slug,position) where d.slug='filosofia'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subjects (discipline_id,name,slug,position)
select d.id,v.name,v.slug,v.position from disciplines d cross join (values ('Sociologia Geral','sociologia-geral',10),('Cidadania e Direitos','cidadania-direitos-sociais',20),('Estado e Poder','estado-poder-sociologia',30)) v(name,slug,position) where d.slug='sociologia'
on conflict (discipline_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;

insert into discipline_topics (subject_id,name,slug,position)
select s.id,v.name,v.slug,v.position from discipline_subjects s join disciplines d on d.id=s.discipline_id join (values
 ('brasil-historia','Brasil Colônia','brasil-colonia',10),('brasil-historia','Brasil República','brasil-republica',20),('mundo-contemporaneo-historia','Revoluções','revolucoes',10),('mundo-contemporaneo-historia','Guerras Mundiais','guerras-mundiais',20),('geopolitica-geografia','Globalização','globalizacao',10),('espaco-brasileiro','Regiões Brasileiras','regioes-brasileiras',10),('meio-ambiente-geografia','Questões Ambientais','questoes-ambientais',10),('etica-filosofia','Teorias Éticas','teorias-eticas',10),('filosofia-politica','Estado e Poder','estado-poder-filosofia',10),('sociologia-geral','Cultura e Sociedade','cultura-sociedade',10),('cidadania-direitos-sociais','Cidadania','cidadania-sociologia',10),('estado-poder-sociologia','Instituições Políticas','instituicoes-politicas',10)
) v(subject_slug,name,slug,position) on v.subject_slug=s.slug where d.slug in ('historia','geografia','filosofia','sociologia')
on conflict (subject_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
insert into discipline_subtopics (topic_id,name,slug,position)
select t.id,v.name,v.slug,v.position from discipline_topics t join discipline_subjects s on s.id=t.subject_id join disciplines d on d.id=s.discipline_id join (values
 ('brasil-colonia','Administração Colonial','administracao-colonial',10),('brasil-republica','Era Vargas','era-vargas',10),('revolucoes','Revolução Francesa','revolucao-francesa',10),('guerras-mundiais','Segunda Guerra Mundial','segunda-guerra',10),('globalizacao','Blocos Econômicos','blocos-economicos',10),('regioes-brasileiras','Divisão Regional','divisao-regional',10),('questoes-ambientais','Desenvolvimento Sustentável','desenvolvimento-sustentavel',10),('teorias-eticas','Ética Aristotélica','etica-aristotelica',10),('estado-poder-filosofia','Contratualismo','contratualismo',10),('cultura-sociedade','Socialização','socializacao',10),('cidadania-sociologia','Direitos Civis e Políticos','direitos-civis-politicos',10),('instituicoes-politicas','Democracia','democracia',10)
) v(topic_slug,name,slug,position) on v.topic_slug=t.slug where d.slug in ('historia','geografia','filosofia','sociologia')
on conflict (topic_id,slug) do update set name=excluded.name,position=excluded.position,is_active=true;
commit;
