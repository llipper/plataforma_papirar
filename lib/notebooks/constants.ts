import type { NotebookItem, NotebookTheme } from "./types"

export const NOTEBOOK_THEMES: Record<
  NotebookTheme,
  {
    glow: string
    accent: string
    badgeBg: string
    badgeText: string
    gradient: string
  }
> = {
  amber: {
    glow: "rgba(245, 158, 11, 0.45)",
    accent: "#f59e0b",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeText: "#fbbf24",
    gradient: "from-amber-600/30 via-amber-900/20 to-neutral-950",
  },
  purple: {
    glow: "rgba(168, 85, 247, 0.45)",
    accent: "#a855f7",
    badgeBg: "rgba(168, 85, 247, 0.15)",
    badgeText: "#c084fc",
    gradient: "from-purple-600/35 via-purple-950/30 to-neutral-950",
  },
  blue: {
    glow: "rgba(59, 130, 246, 0.45)",
    accent: "#3b82f6",
    badgeBg: "rgba(59, 130, 246, 0.15)",
    badgeText: "#60a5fa",
    gradient: "from-blue-600/30 via-blue-950/20 to-neutral-950",
  },
  emerald: {
    glow: "rgba(16, 185, 129, 0.45)",
    accent: "#10b981",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeText: "#34d399",
    gradient: "from-emerald-600/30 via-emerald-950/20 to-neutral-950",
  },
  rose: {
    glow: "rgba(244, 63, 94, 0.45)",
    accent: "#f43f5e",
    badgeBg: "rgba(244, 63, 94, 0.15)",
    badgeText: "#fb7185",
    gradient: "from-rose-600/30 via-rose-950/20 to-neutral-950",
  },
  cyan: {
    glow: "rgba(6, 182, 212, 0.45)",
    accent: "#06b6d4",
    badgeBg: "rgba(6, 182, 212, 0.15)",
    badgeText: "#22d3ee",
    gradient: "from-cyan-600/30 via-cyan-950/20 to-neutral-950",
  },
  indigo: {
    glow: "rgba(99, 102, 241, 0.45)",
    accent: "#6366f1",
    badgeBg: "rgba(99, 102, 241, 0.15)",
    badgeText: "#818cf8",
    gradient: "from-indigo-600/30 via-indigo-950/20 to-neutral-950",
  },
}

export const INITIAL_NOTEBOOKS: NotebookItem[] = [
  {
    id: "notebook-const",
    title: "Direito Constitucional",
    subtitle: "Materiais de estudo",
    materialsCount: 2386,
    theme: "amber",
    category: "Direito",
    accentGlowColor: "#f59e0b",
    coverIllustration: "constitution",
    isFavorite: true,
  },
  {
    id: "notebook-rlm",
    title: "Raciocínio Lógico",
    subtitle: "Materiais de estudo",
    materialsCount: 2386,
    theme: "purple",
    category: "Exatas",
    accentGlowColor: "#a855f7",
    coverIllustration: "logic",
    isFavorite: true,
  },
  {
    id: "notebook-adm",
    title: "Direito Administrativo",
    subtitle: "Materiais de estudo",
    materialsCount: 1840,
    theme: "blue",
    category: "Direito",
    accentGlowColor: "#3b82f6",
    coverIllustration: "administrative",
    isFavorite: false,
  },
  {
    id: "notebook-port",
    title: "Língua Portuguesa",
    subtitle: "Materiais de estudo",
    materialsCount: 3120,
    theme: "emerald",
    category: "Gerais",
    accentGlowColor: "#10b981",
    coverIllustration: "portuguese",
    isFavorite: false,
  },
  {
    id: "notebook-penal",
    title: "Direito Penal",
    subtitle: "Materiais de estudo",
    materialsCount: 1450,
    theme: "rose",
    category: "Direito",
    accentGlowColor: "#f43f5e",
    coverIllustration: "penal",
    isFavorite: false,
  },
  {
    id: "notebook-info",
    title: "Informática para Concursos",
    subtitle: "Materiais de estudo",
    materialsCount: 980,
    theme: "cyan",
    category: "Tecnologia",
    accentGlowColor: "#06b6d4",
    coverIllustration: "tech",
    isFavorite: false,
  },
]
