import type { QuestionData } from "@/lib/questions/types"

export type QuestionFilterState = {
  search: string
  discipline: string
  subject: string
  topic: string
  difficulty: string
  year: string
  board: string
  institution: string
  career: string
  educationLevel: string
  alternativesCount: string
}

export type QuestionFilterOption = {
  value: string
  label: string
}

export type QuestionFilterOptions = {
  disciplines: QuestionFilterOption[]
  subjects: QuestionFilterOption[]
  topics: QuestionFilterOption[]
  difficulties: QuestionFilterOption[]
  years: QuestionFilterOption[]
  boards: QuestionFilterOption[]
  institutions: QuestionFilterOption[]
  careers: QuestionFilterOption[]
  educationLevels: QuestionFilterOption[]
  alternativesCounts: QuestionFilterOption[]
}

export type QuestionFilterProps = {
  questions: QuestionData[]
  onChange: (questions: QuestionData[]) => void
}
