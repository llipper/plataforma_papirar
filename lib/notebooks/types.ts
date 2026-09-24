export type NotebookTheme =
  | "amber"
  | "purple"
  | "blue"
  | "emerald"
  | "rose"
  | "cyan"
  | "indigo"

export interface NotebookItem {
  id: string
  title: string
  subtitle: string
  materialsCount: number
  theme: NotebookTheme
  category?: string
  accentGlowColor: string
  coverIllustration?: string
  lastAccessedAt?: string
  isFavorite?: boolean
}

export type NotebookSortOption = "recent" | "materials" | "alphabetical"
