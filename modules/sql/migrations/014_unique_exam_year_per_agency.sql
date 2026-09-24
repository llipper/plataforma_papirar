-- ============================================================================
-- Papirar | Uma edição por ano em cada órgão
-- ============================================================================

begin;

create unique index if not exists career_exams_agency_year_key
  on career_exams (agency_id, exam_year)
  where exam_year is not null;

comment on index career_exams_agency_year_key is
  'Impede duplicar o mesmo ano de concurso dentro do mesmo órgão.';

commit;
