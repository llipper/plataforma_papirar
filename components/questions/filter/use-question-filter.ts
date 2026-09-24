"use client"

import { useMemo, useState } from "react"
import { filterQuestions, createQuestionFilterOptions } from "@/lib/questions/filter/options"
import type { QuestionData } from "@/lib/questions/types"
import type { QuestionFilterState } from "@/lib/questions/filter/types"

const EMPTY_FILTER: QuestionFilterState = {
  search: "", discipline: "", subject: "", topic: "", difficulty: "", year: "",
  board: "", institution: "", career: "", educationLevel: "", alternativesCount: "",
}

export function useQuestionFilter(questions: QuestionData[], onChange: (questions: QuestionData[]) => void) {
  const [state, setState] = useState<QuestionFilterState>(EMPTY_FILTER)
  const [isExpanded, setIsExpanded] = useState(false)
  const options = useMemo(() => createQuestionFilterOptions(questions), [questions])
  const activeFilters = Object.entries(state).filter(([, value]) => value.trim() !== "").length

  function update(key: keyof QuestionFilterState, value: string) {
    const next = { ...state, [key]: value }
    if (key === "discipline") next.subject = next.topic = ""
    if (key === "subject") next.topic = ""
    setState(next)
    onChange(filterQuestions(questions, next))
  }

  function clear() {
    setState(EMPTY_FILTER)
    onChange(questions)
  }

  return { state, options, isExpanded, setIsExpanded, activeFilters, update, clear }
}
