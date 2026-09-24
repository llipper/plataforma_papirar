import type { QuestionData } from "@/lib/questions/types"
import type { QuestionFilterOption, QuestionFilterOptions } from "./types"

function uniqueOptions(values: Array<string | number | null | undefined>): QuestionFilterOption[] {
  return Array.from(new Set(values.filter((value): value is string | number => value !== null && value !== undefined && String(value).trim() !== "").map(String)))
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }))
    .map((value) => ({ value, label: value }))
}

export function createQuestionFilterOptions(questions: QuestionData[]): QuestionFilterOptions {
  return {
    disciplines: uniqueOptions(questions.map((question) => question.discipline)),
    subjects: uniqueOptions(questions.map((question) => question.subject)),
    topics: uniqueOptions(questions.map((question) => question.topic)),
    difficulties: uniqueOptions(questions.map((question) => question.difficulty)),
    years: uniqueOptions(questions.map((question) => question.year)),
    boards: uniqueOptions(questions.map((question) => question.board)),
    institutions: uniqueOptions(questions.map((question) => question.institution)),
    careers: uniqueOptions(questions.map((question) => question.career)),
    educationLevels: uniqueOptions(questions.map((question) => question.educationLevel)),
    alternativesCounts: uniqueOptions(questions.map((question) => question.alternatives.length)),
  }
}

export function filterQuestions(questions: QuestionData[], state: import("./types").QuestionFilterState) {
  const term = state.search.trim().toLocaleLowerCase("pt-BR")
  return questions.filter((question) => {
    const searchable = [question.code, question.discipline, question.subject, question.topic, question.questionText]
      .filter(Boolean).join(" ").toLocaleLowerCase("pt-BR")
    return (!term || searchable.includes(term))
      && (!state.discipline || question.discipline === state.discipline)
      && (!state.subject || question.subject === state.subject)
      && (!state.topic || question.topic === state.topic)
      && (!state.difficulty || question.difficulty === state.difficulty)
      && (!state.year || String(question.year ?? "") === state.year)
      && (!state.board || question.board === state.board)
      && (!state.institution || question.institution === state.institution)
      && (!state.career || question.career === state.career)
      && (!state.educationLevel || question.educationLevel === state.educationLevel)
      && (!state.alternativesCount || String(question.alternatives.length) === state.alternativesCount)
  })
}
