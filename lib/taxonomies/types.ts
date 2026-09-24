export type TaxonomyKind =
  | "subjects"
  | "careers"
  | "difficulty"
  | "education"
  | "boards"
  | "question-types"

export type QuestionAnswerFormat =
  | "multiple_choice"
  | "true_false"
  | "free_text"

export type TaxonomyLevel =
  | "disciplina"
  | "assunto"
  | "topico"
  | "subtopico"
  | "carreira"
  | "subcarreira"
  | "orgao"
  | "concurso"
  | "cargo"
  | "dificuldade"
  | "nivelEducacional"
  | "banca"
  | "tipoQuestao"

export type TaxonomyItem = {
  id: string
  parentId: string | null
  title: string
  subtitle?: string
  meta: string
  level: TaxonomyLevel
  indent: number
  active: boolean
  questionsCount: number
  displayColor?: string | null
  geographicScopeId?: string | null
  geographicScopeName?: string | null
  federativeUnitId?: string | null
  federativeUnitName?: string | null
  federativeUnitCode?: string | null
  examYear?: number | null
  stateName?: string | null
  uf?: string | null
  scope?: string | null
  answerFormat?: QuestionAnswerFormat | null
  alternativeCount?: number | null
}

export type CreateTaxonomyItemInput = {
  kind: TaxonomyKind
  level: TaxonomyLevel
  name?: string
  parentId?: string | null
  code?: string
  detail?: string
  weight?: number
  position?: number
  displayColor?: string
  stateName?: string
  uf?: string
  scope?: string
  answerFormat?: "multiple_choice" | "true_false" | "free_text"
  alternativeCount?: number | null
  geographicScopeId?: string | null
  federativeUnitId?: string | null
  examYear?: number | null
}

export type UpdateTaxonomyItemInput = {
  kind: TaxonomyKind
  level: TaxonomyLevel
  id: string
  name?: string
  detail?: string
  isActive?: boolean
  stateName?: string
  uf?: string
  scope?: string
  geographicScopeId?: string | null
  federativeUnitId?: string | null
  examYear?: number | null
}

export type DeleteTaxonomyItemInput = {
  kind: TaxonomyKind
  level: TaxonomyLevel
  id: string
}

export type GeographicScope = {
  id: string
  name: string
  abbreviation: string | null
  slug: string
}

export type FederativeUnit = {
  id: string
  name: string
  code: string
  slug: string
}
