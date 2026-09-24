export type RankingPeriod = "weekly" | "monthly" | "all_time"
export type RankingScope = "global" | "career" | "discipline"

export interface RankingEntry {
  id: string
  position: number
  name: string
  avatarUrl?: string | null
  points: number
  answeredQuestions: number
  correctAnswers: number
  accuracy: number
  studyStreak: number
  evolution: number
  isCurrentUser?: boolean
}
