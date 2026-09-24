-- Papirar | Disciplinas adicionais para segurança pública
-- Este arquivo cria apenas as raízes. Cada taxonomia fica em arquivo próprio.

begin;

insert into disciplines (name, slug, abbreviation, position)
values
  ('Legislação de Trânsito', 'legislacao-transito', 'LT', 290),
  ('Criminologia', 'criminologia', 'CRIM', 300),
  ('Medicina Legal', 'medicina-legal', 'ML', 310),
  ('Direito Penal Militar', 'direito-penal-militar', 'DPM', 320),
  ('Direito Processual Penal Militar', 'direito-processual-penal-militar', 'DPPM', 330),
  ('Legislação Militar', 'legislacao-militar', 'LM', 340),
  ('Segurança Pública', 'seguranca-publica', 'SP', 350),
  ('Língua Inglesa', 'lingua-inglesa', 'ING', 360),
  ('Língua Espanhola', 'lingua-espanhola', 'LESP', 370),
  ('Redação', 'redacao', 'RED', 380),
  ('Geografia', 'geografia', 'GEO', 390),
  ('História', 'historia', 'HIS', 400),
  ('Filosofia', 'filosofia', 'FIL', 410),
  ('Sociologia', 'sociologia', 'SOC', 420),
  ('Física', 'fisica', 'FIS', 430),
  ('Química', 'quimica', 'QUI', 440),
  ('Biologia', 'biologia', 'BIO', 450),
  ('Conhecimentos Gerais', 'conhecimentos-gerais', 'CGE', 460),
  ('Conhecimentos Regionais', 'conhecimentos-regionais', 'CRG', 470),
  ('Tecnologia da Informação', 'tecnologia-informacao', 'TI', 480),
  ('Segurança Cibernética', 'seguranca-cibernetica', 'SC', 490)
on conflict (slug) do update set
  name = excluded.name,
  abbreviation = excluded.abbreviation,
  position = excluded.position,
  is_active = true;

commit;
