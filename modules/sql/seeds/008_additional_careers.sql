-- ============================================================================
-- Papirar | Seed adicional de carreiras
-- PostgreSQL
--
-- Dependências:
--   001_create_questions.sql
--   002_create_question_taxonomies.sql
--   003_create_content_and_career_taxonomies.sql
--   004_add_career_exam_location_fields.sql
--   006_expand_geographic_taxonomies.sql
--
-- Seeds anteriores:
--   001_geographic_reference_data.sql
--
-- Estrutura:
--
--   Carreira
--     -> Subcarreira
--       -> Órgão
--         -> Concurso
--           -> Cargo
--
-- Utiliza:
--   administrative_sphere_id
--   federative_unit_id
--
-- Não cria dados geográficos duplicados.
-- ============================================================================

begin;


-- ============================================================================
-- HELPER TEMPORÁRIO
-- ============================================================================

create temporary table tmp_additional_careers (
  career_name text not null,
  career_slug text not null,

  subcareer_name text not null,
  subcareer_slug text not null,

  agency_name text not null,
  agency_slug text not null,

  administrative_sphere_slug text not null,

  -- NULL para órgãos federais/nacionais.
  uf varchar(2),

  exam_name text not null,
  exam_slug text not null,
  exam_year smallint,

  positions jsonb not null
);

truncate table tmp_additional_careers;


-- ============================================================================
-- DADOS
-- ============================================================================

insert into tmp_additional_careers (
  career_name,
  career_slug,

  subcareer_name,
  subcareer_slug,

  agency_name,
  agency_slug,

  administrative_sphere_slug,
  uf,

  exam_name,
  exam_slug,
  exam_year,

  positions
)
values


-- ============================================================================
-- FISCAL E CONTROLE
-- ============================================================================


-- ----------------------------------------------------------------------------
-- Receita Federal
-- ----------------------------------------------------------------------------

(
  'Fiscal e Controle',
  'fiscal-controle',

  'Fiscal',
  'fiscal',

  'Receita Federal do Brasil',
  'receita-federal',

  'federal',
  null,

  'Concurso Receita Federal',
  'concurso-receita-federal',
  2022,

  '[
    {
      "name": "Auditor-Fiscal da Receita Federal do Brasil",
      "slug": "auditor-fiscal-receita-federal"
    },
    {
      "name": "Analista-Tributário da Receita Federal do Brasil",
      "slug": "analista-tributario-receita-federal"
    }
  ]'::jsonb
),


-- ----------------------------------------------------------------------------
-- SEFAZ SP
-- ----------------------------------------------------------------------------

(
  'Fiscal e Controle',
  'fiscal-controle',

  'Fiscal',
  'fiscal',

  'Secretaria da Fazenda e Planejamento do Estado de São Paulo',
  'sefaz-sp',

  'estadual',
  'SP',

  'Concurso SEFAZ SP',
  'concurso-sefaz-sp',
  null,

  '[
    {
      "name": "Auditor Fiscal da Receita Estadual",
      "slug": "auditor-fiscal-receita-estadual"
    }
  ]'::jsonb
),


-- ----------------------------------------------------------------------------
-- CGU
-- ----------------------------------------------------------------------------

(
  'Fiscal e Controle',
  'fiscal-controle',

  'Controle',
  'controle',

  'Controladoria-Geral da União',
  'cgu',

  'federal',
  null,

  'Concurso CGU',
  'concurso-cgu',
  2021,

  '[
    {
      "name": "Auditor Federal de Finanças e Controle",
      "slug": "auditor-federal-financas-controle"
    },
    {
      "name": "Técnico Federal de Finanças e Controle",
      "slug": "tecnico-federal-financas-controle"
    }
  ]'::jsonb
),


-- ----------------------------------------------------------------------------
-- TCU
-- ----------------------------------------------------------------------------

(
  'Fiscal e Controle',
  'fiscal-controle',

  'Controle',
  'controle',

  'Tribunal de Contas da União',
  'tcu',

  'federal',
  null,

  'Concurso TCU',
  'concurso-tcu',
  null,

  '[
    {
      "name": "Auditor Federal de Controle Externo",
      "slug": "auditor-federal-controle-externo"
    },
    {
      "name": "Técnico Federal de Controle Externo",
      "slug": "tecnico-federal-controle-externo"
    }
  ]'::jsonb
),


-- ============================================================================
-- TRIBUNAIS
-- ============================================================================


-- ----------------------------------------------------------------------------
-- Justiça Federal
-- ----------------------------------------------------------------------------

(
  'Tribunais',
  'tribunais',

  'Justiça Federal',
  'justica-federal',

  'Tribunal Regional Federal da 1ª Região',
  'trf-1',

  'federal',
  null,

  'Concurso TRF 1',
  'concurso-trf-1',
  null,

  '[
    {
      "name": "Analista Judiciário",
      "slug": "analista-judiciario"
    },
    {
      "name": "Técnico Judiciário",
      "slug": "tecnico-judiciario"
    }
  ]'::jsonb
),


-- ----------------------------------------------------------------------------
-- Justiça do Trabalho
-- ----------------------------------------------------------------------------

(
  'Tribunais',
  'tribunais',

  'Justiça do Trabalho',
  'justica-trabalho',

  'Tribunal Superior do Trabalho',
  'tst',

  'federal',
  null,

  'Concurso TST',
  'concurso-tst',
  null,

  '[
    {
      "name": "Analista Judiciário",
      "slug": "analista-judiciario"
    },
    {
      "name": "Técnico Judiciário",
      "slug": "tecnico-judiciario"
    }
  ]'::jsonb
),


-- ----------------------------------------------------------------------------
-- Justiça Eleitoral
-- ----------------------------------------------------------------------------

(
  'Tribunais',
  'tribunais',

  'Justiça Eleitoral',
  'justica-eleitoral',

  'Tribunal Superior Eleitoral',
  'tse',

  'federal',
  null,

  'Concurso TSE',
  'concurso-tse',
  null,

  '[
    {
      "name": "Analista Judiciário",
      "slug": "analista-judiciario"
    },
    {
      "name": "Técnico Judiciário",
      "slug": "tecnico-judiciario"
    }
  ]'::jsonb
),


-- ============================================================================
-- MINISTÉRIO PÚBLICO
-- ============================================================================


-- ----------------------------------------------------------------------------
-- MPU
-- ----------------------------------------------------------------------------

(
  'Ministério Público',
  'ministerio-publico',

  'Ministério Público da União',
  'ministerio-publico-uniao',

  'Ministério Público da União',
  'mpu',

  'federal',
  null,

  'Concurso MPU',
  'concurso-mpu',
  null,

  '[
    {
      "name": "Analista do MPU",
      "slug": "analista-mpu"
    },
    {
      "name": "Técnico do MPU",
      "slug": "tecnico-mpu"
    }
  ]'::jsonb
),


-- ----------------------------------------------------------------------------
-- MP SP
-- ----------------------------------------------------------------------------

(
  'Ministério Público',
  'ministerio-publico',

  'Ministério Público Estadual',
  'ministerio-publico-estadual',

  'Ministério Público do Estado de São Paulo',
  'mp-sp',

  'estadual',
  'SP',

  'Concurso MP SP',
  'concurso-mp-sp',
  null,

  '[
    {
      "name": "Promotor de Justiça",
      "slug": "promotor-justica"
    },
    {
      "name": "Analista Jurídico",
      "slug": "analista-juridico"
    },
    {
      "name": "Oficial de Promotoria",
      "slug": "oficial-promotoria"
    }
  ]'::jsonb
),


-- ============================================================================
-- DEFENSORIA PÚBLICA
-- ============================================================================


-- ----------------------------------------------------------------------------
-- DPU
-- ----------------------------------------------------------------------------

(
  'Defensoria Pública',
  'defensoria-publica',

  'Defensoria Pública da União',
  'defensoria-publica-uniao',

  'Defensoria Pública da União',
  'dpu',

  'federal',
  null,

  'Concurso DPU',
  'concurso-dpu',
  null,

  '[
    {
      "name": "Defensor Público Federal",
      "slug": "defensor-publico-federal"
    },
    {
      "name": "Analista",
      "slug": "analista"
    },
    {
      "name": "Técnico",
      "slug": "tecnico"
    }
  ]'::jsonb
),


-- ----------------------------------------------------------------------------
-- DP CE
-- ----------------------------------------------------------------------------

(
  'Defensoria Pública',
  'defensoria-publica',

  'Defensoria Pública Estadual',
  'defensoria-publica-estadual',

  'Defensoria Pública do Estado do Ceará',
  'dp-ce',

  'estadual',
  'CE',

  'Concurso DP CE',
  'concurso-dp-ce',
  null,

  '[
    {
      "name": "Defensor Público",
      "slug": "defensor-publico"
    }
  ]'::jsonb
),


-- ============================================================================
-- LEGISLATIVO
-- ============================================================================


-- ----------------------------------------------------------------------------
-- Senado Federal
-- ----------------------------------------------------------------------------

(
  'Legislativo',
  'legislativo',

  'Legislativo Federal',
  'legislativo-federal',

  'Senado Federal',
  'senado-federal',

  'federal',
  null,

  'Concurso Senado Federal',
  'concurso-senado-federal',
  2022,

  '[
    {
      "name": "Analista Legislativo",
      "slug": "analista-legislativo"
    },
    {
      "name": "Técnico Legislativo",
      "slug": "tecnico-legislativo"
    },
    {
      "name": "Consultor Legislativo",
      "slug": "consultor-legislativo"
    }
  ]'::jsonb
),


-- ----------------------------------------------------------------------------
-- Câmara dos Deputados
-- ----------------------------------------------------------------------------

(
  'Legislativo',
  'legislativo',

  'Legislativo Federal',
  'legislativo-federal',

  'Câmara dos Deputados',
  'camara-deputados',

  'federal',
  null,

  'Concurso Câmara dos Deputados',
  'concurso-camara-deputados',
  null,

  '[
    {
      "name": "Analista Legislativo",
      "slug": "analista-legislativo"
    },
    {
      "name": "Técnico Legislativo",
      "slug": "tecnico-legislativo"
    }
  ]'::jsonb
),


-- ----------------------------------------------------------------------------
-- ALECE
-- ----------------------------------------------------------------------------

(
  'Legislativo',
  'legislativo',

  'Legislativo Estadual',
  'legislativo-estadual',

  'Assembleia Legislativa do Estado do Ceará',
  'alece',

  'estadual',
  'CE',

  'Concurso ALECE',
  'concurso-alece',
  null,

  '[
    {
      "name": "Analista Legislativo",
      "slug": "analista-legislativo"
    },
    {
      "name": "Técnico Legislativo",
      "slug": "tecnico-legislativo"
    }
  ]'::jsonb
),


-- ============================================================================
-- BANCÁRIA
-- ============================================================================


-- ----------------------------------------------------------------------------
-- Banco do Brasil
-- ----------------------------------------------------------------------------

(
  'Bancária',
  'bancaria',

  'Bancos Públicos',
  'bancos-publicos',

  'Banco do Brasil',
  'banco-do-brasil',

  'federal',
  null,

  'Concurso Banco do Brasil',
  'concurso-banco-do-brasil',
  2022,

  '[
    {
      "name": "Escriturário",
      "slug": "escriturario"
    }
  ]'::jsonb
),


-- ----------------------------------------------------------------------------
-- Caixa
-- ----------------------------------------------------------------------------

(
  'Bancária',
  'bancaria',

  'Bancos Públicos',
  'bancos-publicos',

  'Caixa Econômica Federal',
  'caixa-economica-federal',

  'federal',
  null,

  'Concurso Caixa Econômica Federal',
  'concurso-caixa',
  2024,

  '[
    {
      "name": "Técnico Bancário Novo",
      "slug": "tecnico-bancario-novo"
    }
  ]'::jsonb
);


-- ============================================================================
-- APLICAÇÃO
-- ============================================================================

do $$
declare
  v_career_id uuid;
  v_subcareer_id uuid;

  v_administrative_sphere_id uuid;
  v_federative_unit_id uuid;

  v_agency_id uuid;
  v_exam_id uuid;

  v_seed record;
  v_position record;

begin

  for v_seed in
    select *
    from tmp_additional_careers
    order by
      career_name,
      subcareer_name,
      agency_name
  loop


    -- =========================================================================
    -- RESET
    -- =========================================================================

    v_career_id := null;
    v_subcareer_id := null;

    v_administrative_sphere_id := null;
    v_federative_unit_id := null;

    v_agency_id := null;
    v_exam_id := null;


    -- =========================================================================
    -- ADMINISTRATIVE SPHERE
    -- =========================================================================

    select id
    into v_administrative_sphere_id
    from administrative_spheres
    where slug = v_seed.administrative_sphere_slug
      and is_active = true;

    if v_administrative_sphere_id is null then
      raise exception
        'Administrative sphere "%" was not found or is inactive.',
        v_seed.administrative_sphere_slug;
    end if;


    -- =========================================================================
    -- FEDERATIVE UNIT
    -- =========================================================================

    if v_seed.uf is not null then

      select id
      into v_federative_unit_id
      from federative_units
      where code = upper(v_seed.uf)
        and is_active = true;

      if v_federative_unit_id is null then
        raise exception
          'Federative unit "%" was not found or is inactive.',
          v_seed.uf;
      end if;

    end if;


    -- =========================================================================
    -- GEOGRAPHIC VALIDATION
    -- =========================================================================

    if v_seed.administrative_sphere_slug = 'federal'
       and v_seed.uf is not null then

      raise exception
        'Federal agency "%" cannot have a federative unit in this seed.',
        v_seed.agency_name;

    end if;


    if v_seed.administrative_sphere_slug in (
      'estadual',
      'distrital'
    )
    and v_seed.uf is null then

      raise exception
        'Agency "%" requires a federative unit.',
        v_seed.agency_name;

    end if;


    -- =========================================================================
    -- CAREER
    -- =========================================================================

    insert into careers (
      name,
      slug
    )
    values (
      v_seed.career_name,
      v_seed.career_slug
    )

    on conflict (slug)
    do update
    set
      name = excluded.name,
      is_active = true

    returning id
    into v_career_id;


    -- =========================================================================
    -- SUBCAREER
    -- =========================================================================

    insert into career_subcareers (
      career_id,
      name,
      slug
    )
    values (
      v_career_id,
      v_seed.subcareer_name,
      v_seed.subcareer_slug
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


    -- =========================================================================
    -- AGENCY
    -- =========================================================================
    --
    -- geographic_scope_id ainda é obrigatório no schema atual.
    --
    -- Durante a transição:
    --
    -- federal   -> nacional
    -- estadual  -> estadual
    -- distrital -> distrital
    -- municipal -> municipal
    --
    -- Quando geographic_scopes for removido definitivamente,
    -- esta parte também poderá ser removida.
    -- =========================================================================

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

      (
        select gs.id
        from geographic_scopes gs
        where gs.slug =
          case v_seed.administrative_sphere_slug
            when 'federal' then 'nacional'
            when 'estadual' then 'estadual'
            when 'distrital' then 'distrital'
            when 'municipal' then 'municipal'
          end
      ),

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


    -- =========================================================================
    -- EXAM
    -- =========================================================================

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


    -- =========================================================================
    -- POSITIONS
    -- =========================================================================

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
          'Invalid position name for exam "%".',
          v_seed.exam_name;

      end if;


      if v_position.slug is null
         or btrim(v_position.slug) = '' then

        raise exception
          'Invalid position slug for exam "%".',
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
-- VALIDAÇÕES
-- ============================================================================

do $$
begin

  if exists (
    select 1
    from career_agencies
    where administrative_sphere_id is null
  ) then

    raise exception
      'Existem órgãos sem esfera administrativa.';

  end if;


  if exists (
    select 1
    from career_agencies ca
    join administrative_spheres asp
      on asp.id = ca.administrative_sphere_id
    where asp.slug in ('estadual', 'distrital')
      and ca.federative_unit_id is null
  ) then

    raise exception
      'Existem órgãos estaduais/distritais sem unidade federativa.';

  end if;

end;
$$;


-- ============================================================================
-- CLEANUP
-- ============================================================================

drop table tmp_additional_careers;


commit;
