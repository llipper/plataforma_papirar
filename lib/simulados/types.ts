export type SimuladoDifficulty = "Fácil" | "Médio" | "Difícil"

export interface SimuladoItem {
  id: string
  title: string
  subject: string
  questionsCount: number
  duration: string // ex: "1h", "1h 30m", "2h"
  difficulty: SimuladoDifficulty
  description: string
  quote?: string
}

export type SimuladoAlternativeKey = "A" | "B" | "C" | "D" | "E"

export interface SimuladoAlternative {
  key: SimuladoAlternativeKey
  text: string
}

export interface SimuladoQuestion {
  id: string
  order: number
  discipline: string
  topic: string
  statement: string
  alternatives: SimuladoAlternative[]
}

export type SimuladoAnswers = Partial<Record<string, SimuladoAlternativeKey>>
