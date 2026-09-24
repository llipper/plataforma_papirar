-- PPCE: Polícia Penal do Ceará.
-- O arquivo PPCE não informa o ano nem a banca; por isso esses campos ficam NULL.
begin;
do $$
declare
  v_career_id uuid;
  v_subcareer_id uuid;
  v_agency_id uuid;
  v_exam_id uuid;
  v_scope_id uuid;
  v_sphere_id uuid;
  v_uf_id uuid;
begin
  insert into careers (name,slug,position,is_active)
  values ('Segurança Pública','seguranca-publica',10,true)
  on conflict (slug) do update set name=excluded.name,is_active=true
  returning id into v_career_id;

  insert into career_subcareers (career_id,name,slug,position,is_active)
  values (v_career_id,'Polícia Penal','policia-penal',30,true)
  on conflict (career_id,slug) do update set name=excluded.name,is_active=true
  returning id into v_subcareer_id;

  select id into v_scope_id from geographic_scopes where slug='estadual' and is_active;
  select id into v_sphere_id from administrative_spheres where slug='estadual' and is_active;
  select id into v_uf_id from federative_units where code='CE' and is_active;

  if v_scope_id is null or v_sphere_id is null or v_uf_id is null then
    raise exception 'Geografia estadual do Ceará não está cadastrada.';
  end if;

  insert into career_agencies (
    subcareer_id,name,slug,position,is_active,
    geographic_scope_id,administrative_sphere_id,federative_unit_id
  ) values (
    v_subcareer_id,'Polícia Penal do Ceará','policia-penal-do-ceara',10,true,
    v_scope_id,v_sphere_id,v_uf_id
  ) on conflict (subcareer_id,slug) do update set
    name=excluded.name,
    geographic_scope_id=excluded.geographic_scope_id,
    administrative_sphere_id=excluded.administrative_sphere_id,
    federative_unit_id=excluded.federative_unit_id,
    is_active=true
  returning id into v_agency_id;

  insert into career_exams (agency_id,name,slug,exam_year,position,is_active)
  values (v_agency_id,'Concurso PPCE','concurso-ppce',null,10,true)
  on conflict (agency_id,slug) do update set name=excluded.name,is_active=true
  returning id into v_exam_id;

  insert into career_positions (exam_id,name,slug,position,is_active)
  values (v_exam_id,'Policial Penal','policial-penal',10,true)
  on conflict (exam_id,slug) do update set name=excluded.name,is_active=true;
end $$;
commit;
