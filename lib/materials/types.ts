export type MaterialDifficulty = "Básico" | "Intermediário" | "Avançado"

export interface MaterialItem {
  id: string
  slug: string
  title: string
  subtitle: string
  discipline: string
  topic: string
  description: string
  duration: string
  sectionsCount: number
  difficulty: MaterialDifficulty
  imageSrc?: string
}
