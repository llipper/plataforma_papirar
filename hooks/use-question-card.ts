"use client"

import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react"
import type {
  ExplanationTab,
} from "@/lib/questions/constants"
import { EXPLANATION_TABS } from "@/lib/questions/constants"
import type {
  QuestionAnswerPayload,
  QuestionAnswerResult,
  QuestionData,
  QuestionReportPayload,
  QuestionUserStatus,
} from "@/lib/questions/types"

export interface UseQuestionCardOptions {
  question: QuestionData
  initialSelectedOption?: string | null
  onAnswerSubmit?: (
    payload: QuestionAnswerPayload
  ) => Promise<QuestionAnswerResult> | QuestionAnswerResult
  onFavoriteToggle?: (questionId: string) => Promise<boolean> | boolean
  onErrorReasonSelect?: (questionId: string, reason: string) => Promise<void> | void
  onReportSubmit?: (payload: QuestionReportPayload) => Promise<void> | void
}

export function useQuestionCard({
  question,
  initialSelectedOption = null,
  onAnswerSubmit,
  onFavoriteToggle,
  onErrorReasonSelect,
  onReportSubmit,
}: UseQuestionCardOptions) {
  const [selectedOption, setSelectedOption] = useState<string | null>(initialSelectedOption)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(
    Boolean(question.userStatus && question.userStatus !== "none")
  )
  const [currentStatus, setCurrentStatus] = useState<QuestionUserStatus>(
    question.userStatus ?? "none"
  )
  const [seconds, setSeconds] = useState<number>(0)
  const [excludedOptions, setExcludedOptions] = useState<string[]>([])
  const [selectedReason, setSelectedReason] = useState<string | null>(null)

  const [showExplanation, setShowExplanation] = useState<boolean>(false)
  const [explanationTab, setExplanationTab] = useState<ExplanationTab>(
    EXPLANATION_TABS.resolution
  )
  const [showStats, setShowStats] = useState<boolean>(false)
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false)
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false)
  const [isFavorited, setIsFavorited] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [revealedQuestion, setRevealedQuestion] = useState<QuestionData | null>(null)

  // Cronômetro para medir o tempo até a submissão
  useEffect(() => {
    if (isSubmitted) return

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isSubmitted])

  // Identifica gabarito correto
  const correctAlternative = useMemo(
    () => question.alternatives.find((alt) => alt.isCorrect),
    [question.alternatives]
  )

  const isCorrect = useMemo(() => {
    if (currentStatus !== "none") return currentStatus === "correct"
    if (!selectedOption || !correctAlternative) return false
    return selectedOption === correctAlternative.letter
  }, [selectedOption, correctAlternative, currentStatus])

  // Selecionar alternativa
  const handleOptionSelect = useCallback(
    (letter: string) => {
      if (isSubmitted || excludedOptions.includes(letter)) return
      setSelectedOption((prev) => (prev === letter ? null : letter))
    },
    [isSubmitted, excludedOptions]
  )

  // Descartar/riscar alternativa
  const toggleExcludeOption = useCallback(
    (e: MouseEvent, letter: string) => {
      e.stopPropagation()
      if (isSubmitted) return

      setExcludedOptions((prev) =>
        prev.includes(letter) ? prev.filter((item) => item !== letter) : [...prev, letter]
      )

      if (selectedOption === letter) {
        setSelectedOption(null)
      }
    },
    [isSubmitted, selectedOption]
  )

  // Submissão da resposta
  const handleSubmit = useCallback(async () => {
    if (!selectedOption || isSubmitted || isSaving) return

    const selectedAlternative = question.alternatives.find(
      (alt) => alt.letter === selectedOption
    )

    setIsSaving(true)
    setIsPending(true)
    setSubmitError(null)
    setIsSubmitted(true)
    setCurrentStatus("none")
    try {
      if (onAnswerSubmit) {
        const result = await onAnswerSubmit({
          questionId: question.id,
          alternativeId: selectedAlternative?.id,
          alternativeLetter: selectedOption,
          timeSeconds: seconds,
        })
        setIsSubmitted(true)
        setCurrentStatus(result.isCorrect ? "correct" : "wrong")
        if (result.question) setRevealedQuestion(result.question as QuestionData)
      } else {
        // Modo local padrão
        const correct = selectedAlternative?.isCorrect ?? false
        setIsSubmitted(true)
        setCurrentStatus(correct ? "correct" : "wrong")
      }
    } catch (error) {
      setIsSubmitted(false)
      setCurrentStatus("none")
      setSubmitError(error instanceof Error ? error.message : "Não foi possível registrar a resposta.")
    } finally {
      setIsSaving(false)
      setIsPending(false)
    }
  }, [selectedOption, isSubmitted, isSaving, question.alternatives, question.id, seconds, onAnswerSubmit])

  // Alternar Gabarito Comentado
  const toggleExplanation = useCallback(() => {
    setShowExplanation((prev) => {
      const next = !prev
      if (next) setShowStats(false)
      return next
    })
  }, [])

  // Alternar Estatísticas
  const toggleStats = useCallback(() => {
    setShowStats((prev) => {
      const next = !prev
      if (next) setShowExplanation(false)
      return next
    })
  }, [])

  // Favoritar
  const toggleFavorite = useCallback(async () => {
    if (onFavoriteToggle) {
      const nextState = await onFavoriteToggle(question.id)
      setIsFavorited(nextState)
    } else {
      setIsFavorited((prev) => !prev)
    }
  }, [onFavoriteToggle, question.id])

  // Selecionar motivo do erro
  const handleReasonSelect = useCallback(
    async (reason: string) => {
      const newReason = selectedReason === reason ? null : reason
      setSelectedReason(newReason)
      if (newReason && onErrorReasonSelect) {
        await onErrorReasonSelect(question.id, newReason)
      }
    },
    [selectedReason, onErrorReasonSelect, question.id]
  )

  // Reportar erro
  const handleReportSubmit = useCallback(
    async (description: string, reason?: string) => {
      if (onReportSubmit) {
        await onReportSubmit({
          questionId: question.id,
          description,
          reason,
        })
      }
      setReportModalOpen(false)
    },
    [onReportSubmit, question.id]
  )

  return {
    selectedOption,
    isSubmitted,
    currentStatus,
    seconds,
    excludedOptions,
    selectedReason,
    isSaving,
    isPending,
    submitError,
    revealedQuestion,
    isCorrect,
    showExplanation,
    explanationTab,
    showStats,
    videoModalOpen,
    reportModalOpen,
    isFavorited,
    correctAlternative,
    handleOptionSelect,
    toggleExcludeOption,
    handleSubmit,
    toggleExplanation,
    setExplanationTab,
    toggleStats,
    toggleFavorite,
    handleReasonSelect,
    setVideoModalOpen,
    setReportModalOpen,
    handleReportSubmit,
  }
}
