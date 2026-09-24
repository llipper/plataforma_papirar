import {
  ZapOff,
  BookX,
  Ghost,
  Search,
  Brain,
  Dices,
} from "lucide-react"
import type { ErrorReasonOption, QuestionDifficulty } from "./types"

export const QUESTION_DIFFICULTIES: Record<
  QuestionDifficulty,
  { label: string; color: string; badgeClass: string }
> = {
  facil: {
    label: "Fácil",
    color: "text-emerald-500",
    badgeClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  medio: {
    label: "Médio",
    color: "text-amber-500",
    badgeClass: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  dificil: {
    label: "Difícil",
    color: "text-orange-500",
    badgeClass: "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
  },
  muito_dificil: {
    label: "Muito Difícil",
    color: "text-red-500",
    badgeClass: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
  },
} as const

export function getDifficultyLabel(difficulty: string): string {
  if (difficulty in QUESTION_DIFFICULTIES) {
    return QUESTION_DIFFICULTIES[difficulty as QuestionDifficulty].label
  }
  return difficulty
}

export function getDifficultyColor(difficulty: string): string {
  if (difficulty in QUESTION_DIFFICULTIES) {
    return QUESTION_DIFFICULTIES[difficulty as QuestionDifficulty].color
  }
  return "text-muted-foreground"
}

export const ERROR_REASONS: ErrorReasonOption[] = [
  { id: "lack_of_attention", label: "Falta de Atenção", icon: ZapOff, color: "text-amber-500" },
  { id: "unmastered_subject", label: "Assunto Não Dominado", icon: BookX, color: "text-red-500" },
  { id: "trick_question", label: "Pegadinha / Distração", icon: Ghost, color: "text-purple-500" },
  { id: "text_interpretation", label: "Interpretação de Texto", icon: Search, color: "text-blue-500" },
  { id: "forgetfulness", label: "Esquecimento", icon: Brain, color: "text-pink-500" },
  { id: "guess", label: "Chute", icon: Dices, color: "text-slate-500" },
]

export const EXPLANATION_TABS = {
  resolution: "resolution",
  alternatives: "alternatives",
  academic: "academic",
} as const

export type ExplanationTab = (typeof EXPLANATION_TABS)[keyof typeof EXPLANATION_TABS]
