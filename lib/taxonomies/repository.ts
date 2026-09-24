import { query } from "../db/postgres.js"

import type {
  CreateTaxonomyItemInput,
  DeleteTaxonomyItemInput,
  FederativeUnit,
  GeographicScope,
  TaxonomyItem,
  TaxonomyKind,
  TaxonomyLevel,
  QuestionAnswerFormat,
  UpdateTaxonomyItemInput,
} from "./types.js"

type LevelConfig = {
  kind: TaxonomyKind
  table: string
  level: TaxonomyLevel

  parentColumn?: string
  parentLevel?: TaxonomyLevel

  label: string

  codeColumn?: string
  colorColumn?: string

  hasGeography?: boolean
  hasExamYear?: boolean
}

const configs: Record<TaxonomyLevel, LevelConfig> = {
  disciplina: {
    kind: "subjects",
    table: "disciplines",
    level: "disciplina",
    label: "DISCIPLINA",
    codeColumn: "abbreviation",
  },

  assunto: {
    kind: "subjects",
    table: "discipline_subjects",
    level: "assunto",
    parentColumn: "discipline_id",
    parentLevel: "disciplina",
    label: "ASSUNTO",
  },

  topico: {
    kind: "subjects",
    table: "discipline_topics",
    level: "topico",
    parentColumn: "subject_id",
    parentLevel: "assunto",
    label: "TÓPICO",
  },

  subtopico: {
    kind: "subjects",
    table: "discipline_subtopics",
    level: "subtopico",
    parentColumn: "topic_id",
    parentLevel: "topico",
    label: "SUBTÓPICO",
  },

  carreira: {
    kind: "careers",
    table: "careers",
    level: "carreira",
    label: "CARREIRA",
  },

  subcarreira: {
    kind: "careers",
    table: "career_subcareers",
    level: "subcarreira",
    parentColumn: "career_id",
    parentLevel: "carreira",
    label: "SUBCARREIRA",
  },

  orgao: {
    kind: "careers",
    table: "career_agencies",
    level: "orgao",
    parentColumn: "subcareer_id",
    parentLevel: "subcarreira",
    label: "ÓRGÃO",
    hasGeography: true,
  },

  concurso: {
    kind: "careers",
    table: "career_exams",
    level: "concurso",
    parentColumn: "agency_id",
    parentLevel: "orgao",
    label: "CONCURSO",
    hasExamYear: true,
  },

  cargo: {
    kind: "careers",
    table: "career_positions",
    level: "cargo",
    parentColumn: "exam_id",
    parentLevel: "concurso",
    label: "CARGO",
  },

  dificuldade: {
    kind: "difficulty",
    table: "question_difficulties",
    level: "dificuldade",
    label: "DIFICULDADE",
    codeColumn: "abbreviation",
    colorColumn: "display_color",
  },

  nivelEducacional: {
    kind: "education",
    table: "education_levels",
    level: "nivelEducacional",
    label: "EDUCACIONAL",
    codeColumn: "abbreviation",
  },

  banca: {
    kind: "boards",
    table: "exam_boards",
    level: "banca",
    label: "BANCA",
    codeColumn: "abbreviation",
  },

  tipoQuestao: {
    kind: "question-types",
    table: "question_types",
    level: "tipoQuestao",
    label: "TIPO",
    codeColumn: "abbreviation",
  },
}

const kindLevels: Record<TaxonomyKind, TaxonomyLevel[]> = {
  subjects: [
    "disciplina",
    "assunto",
    "topico",
    "subtopico",
  ],

  careers: [
    "carreira",
    "subcarreira",
    "orgao",
    "concurso",
    "cargo",
  ],

  difficulty: ["dificuldade"],
  education: ["nivelEducacional"],
  boards: ["banca"],
  "question-types": ["tipoQuestao"],
}

type TaxonomyRow = {
  id: string
  parent_id: string | null

  name: string
  subtitle: string | null

  is_active: boolean
  position: number

  level: TaxonomyLevel
  indent: number
  meta: string

  display_color: string | null

  geographic_scope_id: string | null
  geographic_scope_name: string | null

  federative_unit_id: string | null
  federative_unit_name: string | null
  federative_unit_code: string | null

  exam_year: number | null
  answer_format: QuestionAnswerFormat | null
  alternative_count: number | null
}

type GeographicScopeRow = {
  id: string
  name: string
  abbreviation: string | null
  slug: string
}

type FederativeUnitRow = {
  id: string
  name: string
  code: string
  slug: string
}

function assertConfig(
  kind: TaxonomyKind,
  level: TaxonomyLevel
) {
  const config = configs[level]

  if (!config || config.kind !== kind) {
    throw new Error(
      "Taxonomia inválida para esta rota."
    )
  }

  return config
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
}

function nullableInteger(
  value: number | undefined | null
) {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : undefined
}

function alternativeCountFor(
  input: CreateTaxonomyItemInput
) {
  if (input.answerFormat === "free_text") {
    return null
  }

  if (input.answerFormat === "true_false") {
    return 2
  }

  const count = nullableInteger(input.alternativeCount) ?? 5

  if (count !== 4 && count !== 5) {
    throw new Error("Questões de múltipla escolha devem ter 4 ou 5 alternativas.")
  }

  return count
}

function toItem(
  row: TaxonomyRow
): TaxonomyItem {
  return {
    id: row.id,
    parentId: row.parent_id,

    title: row.name,

    subtitle:
      row.subtitle ??
      (row.level !== "concurso" && row.exam_year !== null
        ? String(row.exam_year)
        : undefined),

    meta: row.meta,

    level: row.level,
    indent: row.indent,

    active: row.is_active,

    questionsCount: 0,

    displayColor:
      row.display_color,

    geographicScopeId:
      row.geographic_scope_id,

    geographicScopeName:
      row.geographic_scope_name,

    federativeUnitId:
      row.federative_unit_id,

    federativeUnitName:
      row.federative_unit_name,

    federativeUnitCode:
      row.federative_unit_code,

    examYear:
      row.exam_year,

    answerFormat:
      row.answer_format,

    alternativeCount:
      row.alternative_count,
  }
}

export async function listTaxonomyItems(
  kind: TaxonomyKind
) {
  if (!kindLevels[kind]) {
    throw new Error(
      "Taxonomia inválida."
    )
  }

  const selects =
    kindLevels[kind].map(
      (level) => {
        const config =
          configs[level]

        const parentSelect =
          config.parentColumn
            ? `t.${config.parentColumn} as parent_id`
            : "null::uuid as parent_id"

        const subtitleSelect =
          config.codeColumn
            ? `t.${config.codeColumn}::text as subtitle`
            : "null::text as subtitle"

        const colorSelect =
          config.colorColumn
            ? `t.${config.colorColumn}::text as display_color`
            : "null::text as display_color"

        const examYearSelect =
          config.hasExamYear
            ? "t.exam_year::integer as exam_year"
            : "null::integer as exam_year"

        const questionTypeSelect =
          config.level === "tipoQuestao"
            ? "t.answer_format::text as answer_format, t.alternative_count::integer as alternative_count"
            : "null::text as answer_format, null::integer as alternative_count"

        const geographySelect =
          config.hasGeography
            ? `
              t.geographic_scope_id as geographic_scope_id,
              gs.name::text as geographic_scope_name,

              t.federative_unit_id as federative_unit_id,
              fu.name::text as federative_unit_name,
              fu.code::text as federative_unit_code
            `
            : `
              null::uuid as geographic_scope_id,
              null::text as geographic_scope_name,

              null::uuid as federative_unit_id,
              null::text as federative_unit_name,
              null::text as federative_unit_code
            `

        const geographyJoins =
          config.hasGeography
            ? `
              left join geographic_scopes gs
                on gs.id = t.geographic_scope_id

              left join federative_units fu
                on fu.id = t.federative_unit_id
            `
            : ""

        return `
          select
            t.id,
            ${parentSelect},

            t.name,
            ${subtitleSelect},

            t.is_active,
            t.position,

            ${colorSelect},

            ${geographySelect},

            ${examYearSelect},

            ${questionTypeSelect},

            '${config.level}'::text as level,
            ${levelIndent(config.level)}::integer as indent,
            '${config.label}'::text as meta

          from ${config.table} t

          ${geographyJoins}
        `
      }
    )

  const result =
    await query<TaxonomyRow>(
      `
        with items as (
          ${selects.join(
            "\nunion all\n"
          )}
        )

        select *
        from items

        order by
          indent,
          position,
          lower(name)
      `
    )

  return orderHierarchy(
    result.rows.map(toItem)
  )
}

export async function createTaxonomyItem(
  input: CreateTaxonomyItemInput
) {
  const config = assertConfig(
    input.kind,
    input.level
  )

  const isExam = input.level === "concurso"
  const examYear = nullableInteger(input.examYear)

  if (isExam && (examYear === undefined || examYear < 1900 || examYear > 2200)) {
    throw new Error("Informe um ano de concurso válido entre 1900 e 2200.")
  }

  const name = isExam
    ? `Concurso ${examYear}`
    : (input.name ?? "").trim()

  if (!name) {
    throw new Error(
      "Nome é obrigatório."
    )
  }

  if (
    config.parentColumn &&
    !input.parentId
  ) {
    throw new Error(
      "Item pai é obrigatório."
    )
  }

  const slug = slugify(input.code?.trim() || name)

  if (!slug) {
    throw new Error(
      "Não foi possível gerar o identificador do cadastro."
    )
  }

  const columns = [
    "name",
    "slug",
  ]

  const values: unknown[] = [
    name,
    slug,
  ]

  if (config.parentColumn) {
    columns.push(
      config.parentColumn
    )

    values.push(
      input.parentId
    )
  }

  if (config.codeColumn) {
    columns.push(
      config.codeColumn
    )

    values.push(
      input.code?.trim() ||
        null
    )
  }

  if (
    input.position !== undefined
  ) {
    columns.push("position")
    values.push(input.position)
  }

  if (
    input.level ===
    "dificuldade"
  ) {
    columns.push("weight")

    values.push(
      input.weight ?? 1
    )

    if (input.displayColor) {
      columns.push(
        "display_color"
      )

      values.push(
        input.displayColor
      )
    }
  }

  if (
    input.level ===
    "concurso"
  ) {
    columns.push("exam_year")
    values.push(examYear)
  }

  if (
    input.level ===
    "orgao"
  ) {
    if (
      !input.geographicScopeId
    ) {
      throw new Error(
        "Abrangência geográfica é obrigatória para o órgão."
      )
    }

    columns.push(
      "geographic_scope_id",
      "federative_unit_id"
    )

    values.push(
      input.geographicScopeId,
      input.federativeUnitId ??
        null
    )
  }

  if (
    input.level ===
    "tipoQuestao"
  ) {
    columns.push(
      "answer_format",
      "alternative_count"
    )

    values.push(
      input.answerFormat ??
        "multiple_choice",

      alternativeCountFor(
        input
      )
    )
  }

  const placeholders =
    values.map(
      (_, index) =>
        `$${index + 1}`
    )

  await query(
    `
      insert into ${config.table}
        (${columns.join(", ")})

      values
        (${placeholders.join(", ")})
    `,
    values
  )
}

export async function updateTaxonomyItem(
  input: UpdateTaxonomyItemInput
) {
  const config = assertConfig(
    input.kind,
    input.level
  )

  const updates: string[] = []
  const values: unknown[] = []

  if (
    input.level !== "concurso" &&
    typeof input.name === "string" &&
    input.name.trim()
  ) {
    values.push(
      input.name.trim()
    )

    updates.push(
      `name = $${values.length}`
    )
  }

  if (
    typeof input.isActive ===
    "boolean"
  ) {
    values.push(
      input.isActive
    )

    updates.push(
      `is_active = $${values.length}`
    )
  }

  if (input.level === "concurso" && input.examYear !== undefined) {
    const examYear = nullableInteger(input.examYear)

    if (examYear === undefined || examYear < 1900 || examYear > 2200) {
      throw new Error("Informe um ano de concurso válido entre 1900 e 2200.")
    }

    values.push(examYear)
    updates.push(`exam_year = $${values.length}`)

    values.push(`Concurso ${examYear}`)
    updates.push(`name = $${values.length}`)

    values.push(slugify(`concurso-${examYear}`))
    updates.push(`slug = $${values.length}`)
  }

  if (
    input.level ===
    "orgao"
  ) {
    if (
      input.geographicScopeId !==
      undefined
    ) {
      if (
        !input.geographicScopeId
      ) {
        throw new Error(
          "Abrangência geográfica é obrigatória para o órgão."
        )
      }

      values.push(
        input.geographicScopeId
      )

      updates.push(
        `geographic_scope_id = $${values.length}`
      )
    }

    if (
      input.federativeUnitId !==
      undefined
    ) {
      values.push(
        input.federativeUnitId
      )

      updates.push(
        `federative_unit_id = $${values.length}`
      )
    }
  }

  if (!updates.length) {
    return
  }

  values.push(input.id)

  await query(
    `
      update ${config.table}

      set
        ${updates.join(", ")}

      where id = $${values.length}
    `,
    values
  )
}

export async function deleteTaxonomyItem(
  input: DeleteTaxonomyItemInput
) {
  const config = assertConfig(
    input.kind,
    input.level
  )

  await query(
    `
      delete from ${config.table}
      where id = $1
    `,
    [input.id]
  )
}

export async function listGeographicScopes(): Promise<
  GeographicScope[]
> {
  const result =
    await query<GeographicScopeRow>(
      `
        select
          id,
          name,
          abbreviation,
          slug

        from geographic_scopes

        where is_active = true

        order by
          position,
          lower(name)
      `
    )

  return result.rows
}

export async function listFederativeUnits(): Promise<
  FederativeUnit[]
> {
  const result =
    await query<FederativeUnitRow>(
      `
        select
          id,
          name,
          code,
          slug

        from federative_units

        where is_active = true

        order by
          position,
          lower(name)
      `
    )

  return result.rows
}

export async function listGeographyOptions() {
  const [
    geographicScopes,
    federativeUnits,
  ] = await Promise.all([
    listGeographicScopes(),
    listFederativeUnits(),
  ])

  return {
    geographicScopes,
    federativeUnits,
  }
}

function levelIndent(
  level: TaxonomyLevel
) {
  const indents: Record<
    TaxonomyLevel,
    number
  > = {
    disciplina: 0,
    assunto: 1,
    topico: 2,
    subtopico: 3,

    carreira: 0,
    subcarreira: 1,
    orgao: 2,
    concurso: 3,
    cargo: 4,

    dificuldade: 0,
    nivelEducacional: 0,
    banca: 0,
    tipoQuestao: 0,
  }

  return indents[level]
}

function orderHierarchy(
  items: TaxonomyItem[]
) {
  const ordered: TaxonomyItem[] =
    []

  function visit(
    parentId: string | null
  ) {
    items
      .filter(
        (item) =>
          item.parentId ===
          parentId
      )
      .sort(
        (first, second) =>
          first.title.localeCompare(
            second.title,
            "pt-BR"
          )
      )
      .forEach((item) => {
        ordered.push(item)
        visit(item.id)
      })
  }

  visit(null)

  return ordered
}
