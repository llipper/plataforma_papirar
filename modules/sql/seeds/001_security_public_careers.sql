begin;

-- ============================================================================
-- Papirar | Seed controlado de carreiras de Segurança Pública
--
-- Dependências:
--   001_create_questions.sql
--   002_create_question_taxonomies.sql
--   003_create_content_and_career_taxonomies.sql
--   004_add_career_exam_location_fields.sql
--
-- Seeds obrigatórios anteriores:
--   001_geographic_reference_data.sql
--
-- Estrutura:
--
--   Carreira
--     -> Subcarreira
--       -> Órgão
--            -> Abrangência
--            -> Unidade Federativa (quando aplicável)
--         -> Concurso
--           -> Cargo
--
-- Exemplo:
--
--   Segurança Pública
--     -> Polícia
--       -> Polícia Federal
--          -> Concurso PF
--             -> Agente de Polícia Federal
--
--       -> Polícia Civil de São Paulo
--          -> Concurso PC
--             -> Delegado de Polícia
--
-- Regras:
--
--   Órgão nacional:
--     scope_slug = nacional
--     uf         = NULL
--
--   Órgão estadual:
--     scope_slug = estadual
--     uf         = CE / SP / RJ / ...
--
-- Banco greenfield:
--   - sem compatibilidade legada;
--   - sem legacy slugs;
--   - sem state_name/uf/scope em career_agencies;
--   - sem dados geográficos em career_exams;
--   - execução idempotente;
--   - não duplica carreira, subcarreira, órgão, concurso ou cargo.
-- ============================================================================


-- ============================================================================
-- TEMPORARY SEED DATA
-- ============================================================================
--
-- A tabela é temporária e existe somente durante a sessão atual.
--
-- IF NOT EXISTS permite executar novamente este seed na mesma conexão.
-- TRUNCATE garante que os dados temporários anteriores sejam removidos antes
-- da nova execução.
-- ============================================================================

create temporary table if not exists tmp_security_public_career_seed (
  agency_name text not null,
  agency_slug text not null,

  exam_name text not null,
  exam_slug text not null,
  exam_year smallint,

  scope_slug text not null,

  -- NULL para órgãos de abrangência nacional.
  uf varchar(2),

  positions jsonb not null
);


truncate table tmp_security_public_career_seed;


-- ============================================================================
-- SEED DATA
-- ============================================================================

insert into tmp_security_public_career_seed (
  agency_name,
  agency_slug,
  exam_name,
  exam_slug,
  exam_year,
  scope_slug,
  uf,
  positions
)
values

-- --------------------------------------------------------------------------
-- Polícia Federal
-- --------------------------------------------------------------------------

(
  'Polícia Federal',
  'policia-federal',

  'Concurso PF',
  'concurso-pf',
  2025,

  'nacional',
  null,

  '[
    {
      "name": "Agente de Polícia Federal",
      "slug": "agente-de-policia-federal"
    },
    {
      "name": "Escrivão de Polícia Federal",
      "slug": "escrivao-de-policia-federal"
    },
    {
      "name": "Delegado de Polícia Federal",
      "slug": "delegado-de-policia-federal"
    }
  ]'::jsonb
),


-- --------------------------------------------------------------------------
-- Polícia Rodoviária Federal
-- --------------------------------------------------------------------------

(
  'Polícia Rodoviária Federal',
  'policia-rodoviaria-federal',

  'Concurso PRF',
  'concurso-prf',
  2021,

  'nacional',
  null,

  '[
    {
      "name": "Policial Rodoviário Federal",
      "slug": "policial-rodoviario-federal"
    }
  ]'::jsonb
),


-- --------------------------------------------------------------------------
-- Polícia Civil de São Paulo
-- --------------------------------------------------------------------------

(
  'Polícia Civil de São Paulo',
  'policia-civil-de-sao-paulo',

  'Concurso PC',
  'concurso-pc',
  2023,

  'estadual',
  'SP',

  '[
    {
      "name": "Investigador de Polícia",
      "slug": "investigador-de-policia"
    },
    {
      "name": "Escrivão de Polícia",
      "slug": "escrivao-de-policia"
    },
    {
      "name": "Delegado de Polícia",
      "slug": "delegado-de-policia"
    }
  ]'::jsonb
),


-- --------------------------------------------------------------------------
-- Polícia Civil do Rio de Janeiro
-- --------------------------------------------------------------------------

(
  'Polícia Civil do Rio de Janeiro',
  'policia-civil-do-rio-de-janeiro',

  'Concurso PC',
  'concurso-pc',
  2021,

  'estadual',
  'RJ',

  '[
    {
      "name": "Investigador Policial",
      "slug": "investigador-policial"
    },
    {
      "name": "Inspetor de Polícia",
      "slug": "inspetor-de-policia"
    },
    {
      "name": "Delegado de Polícia",
      "slug": "delegado-de-policia"
    }
  ]'::jsonb
),


-- --------------------------------------------------------------------------
-- Polícia Civil do Ceará
-- --------------------------------------------------------------------------

(
  'Polícia Civil do Ceará',
  'policia-civil-do-ceara',

  'Concurso PC',
  'concurso-pc',
  null,

  'estadual',
  'CE',

  '[
    {
      "name": "Oficial Investigador de Polícia",
      "slug": "oficial-investigador-de-policia"
    },
    {
      "name": "Delegado de Polícia",
      "slug": "delegado-de-policia"
    }
  ]'::jsonb
),


-- --------------------------------------------------------------------------
-- Polícia Militar do Ceará
-- --------------------------------------------------------------------------

(
  'Polícia Militar do Ceará',
  'policia-militar-do-ceara',

  'Concurso PM',
  'concurso-pm',
  null,

  'estadual',
  'CE',

  '[
    {
      "name": "Soldado",
      "slug": "soldado"
    },
    {
      "name": "Oficial",
      "slug": "oficial"
    }
  ]'::jsonb
),


-- --------------------------------------------------------------------------
-- Polícia Militar de São Paulo
-- --------------------------------------------------------------------------

(
  'Polícia Militar de São Paulo',
  'policia-militar-de-sao-paulo',

  'Concurso PM',
  'concurso-pm',
  null,

  'estadual',
  'SP',

  '[
    {
      "name": "Soldado",
      "slug": "soldado"
    },
    {
      "name": "Aluno-Oficial",
      "slug": "aluno-oficial"
    }
  ]'::jsonb
);


-- ============================================================================
-- APPLY SEED
-- ============================================================================

do $$
declare
  v_career_id uuid;
  v_subcareer_id uuid;

  v_scope_id uuid;
  v_administrative_sphere_id uuid;
  v_federative_unit_id uuid;

  v_agency_id uuid;
  v_exam_id uuid;

  v_seed record;
  v_position record;
begin

  -- ==========================================================================
  -- CAREER
  -- ==========================================================================
  --
  -- Segurança Pública
  -- ==========================================================================

  insert into careers (
    name,
    slug
  )
  values (
    'Segurança Pública',
    'seguranca-publica'
  )
  on conflict (slug)
  do update
  set
    name = excluded.name,
    is_active = true
  returning id
  into v_career_id;


  -- ==========================================================================
  -- SUBCAREER
  -- ==========================================================================
  --
  -- Segurança Pública
  --   -> Polícia
  -- ==========================================================================

  insert into career_subcareers (
    career_id,
    name,
    slug
  )
  values (
    v_career_id,
    'Polícia',
    'policia'
  )
  on conflict (
    career_id,
    slug
  )
  do update
  set
    name = excluded.name,
    is_active = true
  returning id
  into v_subcareer_id;


  -- ==========================================================================
  -- AGENCIES / EXAMS / POSITIONS
  -- ==========================================================================

  for v_seed in
    select *
    from tmp_security_public_career_seed
    order by agency_name
  loop

    -- ========================================================================
    -- RESET LOOP VARIABLES
    -- ========================================================================

    v_scope_id := null;
    v_administrative_sphere_id := null;
    v_federative_unit_id := null;
    v_agency_id := null;
    v_exam_id := null;


    -- ========================================================================
    -- GEOGRAPHIC SCOPE
    -- ========================================================================

    select gs.id
    into v_scope_id
    from geographic_scopes gs
    where gs.slug = v_seed.scope_slug
      and gs.is_active = true;

    if v_scope_id is null then
      raise exception
        'Geographic scope "%" was not found or is inactive.',
        v_seed.scope_slug;
    end if;

    select asp.id
    into v_administrative_sphere_id
    from administrative_spheres asp
    where asp.slug = case v_seed.scope_slug
      when 'nacional' then 'federal'
      else v_seed.scope_slug
    end
      and asp.is_active = true;

    if v_administrative_sphere_id is null then
      raise exception
        'Administrative sphere for scope "%" was not found or is inactive.',
        v_seed.scope_slug;
    end if;


    -- ========================================================================
    -- FEDERATIVE UNIT
    -- ========================================================================

    if v_seed.uf is not null then

      select fu.id
      into v_federative_unit_id
      from federative_units fu
      where fu.code = upper(v_seed.uf)
        and fu.is_active = true;

      if v_federative_unit_id is null then
        raise exception
          'Federative unit "%" was not found or is inactive.',
          v_seed.uf;
      end if;

    end if;


    -- ========================================================================
    -- GEOGRAPHIC DATA VALIDATION
    -- ========================================================================
    --
    -- nacional:
    --   não deve possuir UF.
    --
    -- estadual:
    --   deve possuir UF.
    --
    -- Essas verificações também deixam erros de seed mais fáceis de
    -- diagnosticar antes do INSERT em career_agencies.
    -- ========================================================================

    if v_seed.scope_slug = 'nacional'
       and v_seed.uf is not null then
      raise exception
        'National agency "%" cannot have federative unit "%".',
        v_seed.agency_name,
        v_seed.uf;
    end if;


    if v_seed.scope_slug = 'estadual'
       and v_seed.uf is null then
      raise exception
        'State agency "%" requires a federative unit.',
        v_seed.agency_name;
    end if;


    -- ========================================================================
    -- AGENCY
    -- ========================================================================

    insert into career_agencies (
      subcareer_id,
      name,
      slug,
      geographic_scope_id,
      administrative_sphere_id,
      federative_unit_id
    )
    values (
      v_subcareer_id,
      v_seed.agency_name,
      v_seed.agency_slug,
      v_scope_id,
      v_administrative_sphere_id,
      v_federative_unit_id
    )
    on conflict (
      subcareer_id,
      slug
    )
    do update
    set
      name = excluded.name,
      geographic_scope_id = excluded.geographic_scope_id,
      administrative_sphere_id = excluded.administrative_sphere_id,
      federative_unit_id = excluded.federative_unit_id,
      is_active = true
    returning id
    into v_agency_id;


    -- ========================================================================
    -- EXAM
    -- ========================================================================

    insert into career_exams (
      agency_id,
      name,
      slug,
      exam_year
    )
    values (
      v_agency_id,
      v_seed.exam_name,
      v_seed.exam_slug,
      v_seed.exam_year
    )
    on conflict (
      agency_id,
      slug
    )
    do update
    set
      name = excluded.name,
      exam_year = excluded.exam_year,
      is_active = true
    returning id
    into v_exam_id;


    -- ========================================================================
    -- POSITIONS
    -- ========================================================================

    for v_position in
      select *
      from jsonb_to_recordset(v_seed.positions)
        as item (
          name text,
          slug text
        )
    loop

      if v_position.name is null
         or btrim(v_position.name) = '' then
        raise exception
          'Position with invalid name found for exam "%".',
          v_seed.exam_name;
      end if;


      if v_position.slug is null
         or btrim(v_position.slug) = '' then
        raise exception
          'Position with invalid slug found for exam "%".',
          v_seed.exam_name;
      end if;


      insert into career_positions (
        exam_id,
        name,
        slug
      )
      values (
        v_exam_id,
        v_position.name,
        v_position.slug
      )
      on conflict (
        exam_id,
        slug
      )
      do update
      set
        name = excluded.name,
        is_active = true;

    end loop;

  end loop;

end;
$$;


-- ============================================================================
-- CLEANUP
-- ============================================================================
--
-- Não precisamos manter os dados auxiliares após o seed.
--
-- Isso também evita que uma nova execução na mesma conexão encontre resíduos
-- da execução anterior.
-- ============================================================================

drop table if exists tmp_security_public_career_seed;

commit;
