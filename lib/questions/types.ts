import type { ComponentType } from "react"

export type QuestionDifficulty = "facil" | "medio" | "dificil" | "muito_dificil"

export type QuestionUserStatus = "correct" | "wrong" | "none"

export interface QuestionAlternative {
  id?: string
  letter: string
  text: string
  isCorrect: boolean
  explanation?: string
  reference?: string
  tip?: string
}

export interface QuestionStatsData {
  totalAnswers: number
  correctRate: number
  averageTimeSeconds?: number
  mostSelectedWrongAlternative?: string
  answerDistribution?: Record<string, {
    percentage: number
    responseCount: number
  }>
}

export interface QuestionVideoLesson {
  title: string
  url: string
  durationMinutes?: number
}

export interface QuestionAuthor {
  id: string
  name: string
  avatarUrl?: string
}

export interface QuestionData {
  id: string
  code: string
  discipline: string
  subject?: string | null
  topic?: string | null
  supportText?: string | null
  questionText: string
  alternatives: QuestionAlternative[]
  difficulty: QuestionDifficulty
  isUnique?: boolean
  year?: string | number
  board?: string | null
  institution?: string | null
  career?: string | null
  educationLevel?: string | null
  resolution?: string | null
  objectives?: string[]
  tip?: string | null
  references?: string[]
  stats?: QuestionStatsData
  commentsCount?: number
  videos?: QuestionVideoLesson[]
  author?: QuestionAuthor
  userStatus?: QuestionUserStatus
}

export interface ErrorReasonOption {
  id: string
  label: string
  icon: ComponentType<{ className?: string }>
  color: string
}

export interface QuestionAnswerPayload {
  questionId: string
  alternativeId?: string
  alternativeLetter: string
  timeSeconds: number
}

export interface QuestionAnswerResult {
  isCorrect: boolean
  correctAlternativeLetter: string
  timeSeconds?: number
  question?: Partial<QuestionData>
}

export interface QuestionReportPayload {
  questionId: string
  reason?: string
  description: string
}
