import type {
  DarkAccent,
  FontSize,
  InterfaceDensity,
  LayoutConfig,
  Radius,
  SidebarVariant,
  TransitionType,
  VisualEffects,
} from "./types"

export const LAYOUT_STORAGE_KEY = "papirar-layout-settings-v1"

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  variant: "inset",
  collapsible: "icon",
  side: "left",
  contentLayout: "full",
  navbarBehavior: "sticky",
  fontSize: "base",
  radius: 0.625,
  primaryColor: "default",
  fontFamily: "sans",
  density: "default",
  effects: "glass",
  containerWidth: "fluid",
  darkAccent: "midnight",
  transition: "smooth",
}

export const FONT_SIZE_OPTIONS: { id: FontSize; label: string }[] = [
  { id: "sm", label: "Pequena" },
  { id: "base", label: "Padrão" },
  { id: "lg", label: "Grande" },
]

export const RADIUS_OPTIONS: { value: Radius; label: string }[] = [
  { value: 0, label: "0" },
  { value: 0.3, label: "0.3" },
  { value: 0.5, label: "0.5" },
  { value: 0.625, label: "0.6" },
  { value: 0.75, label: "0.8" },
  { value: 1.0, label: "1.0" },
]

export const DENSITY_OPTIONS: { id: InterfaceDensity; label: string }[] = [
  { id: "ultra-compact", label: "Ultra" },
  { id: "compact", label: "Compacto" },
  { id: "default", label: "Padrão" },
  { id: "comfortable", label: "Amplo" },
  { id: "spacious", label: "Espaçoso" },
]

export const EFFECTS_OPTIONS: { id: VisualEffects; label: string }[] = [
  { id: "minimalist", label: "Mínimo" },
  { id: "glass", label: "Glass" },
  { id: "frosted", label: "Frosted" },
  { id: "soft", label: "Soft" },
  { id: "matte", label: "Matte" },
  { id: "neon", label: "Neon" },
  { id: "cyber", label: "Cyber" },
]

export const TRANSITION_OPTIONS: { id: TransitionType; label: string }[] = [
  { id: "none", label: "Nenhuma" },
  { id: "fast", label: "Rápida" },
  { id: "smooth", label: "Suave" },
  { id: "slow", label: "Lenta" },
  { id: "bounce", label: "Bounce" },
  { id: "cinematic", label: "Filme" },
]

export const DARK_ACCENT_OPTIONS: { id: DarkAccent; label: string; color: string }[] = [
  { id: "midnight", label: "Midnight", color: "#0f172a" },
  { id: "black", label: "Deep Black", color: "#000000" },
  { id: "slate", label: "Slate", color: "#1e293b" },
  { id: "graphite", label: "Graphite", color: "#27272a" },
  { id: "navy", label: "Navy", color: "#1c2541" },
  { id: "arctic", label: "Arctic", color: "#334155" },
]

export const SIDEBAR_VARIANT_OPTIONS: { id: SidebarVariant; label: string }[] = [
  { id: "sidebar", label: "Padrão" },
  { id: "floating", label: "Flutuante" },
  { id: "inset", label: "Inserida" },
]

export const THEME_PALETTES = [
  { id: "default", label: "Padrão", color: "#64748b" },
  { id: "blue", label: "Policial", color: "#3b82f6" },
  { id: "emerald", label: "Tático", color: "#10b981" },
  { id: "rose", label: "Inteligência", color: "#e11d48" },
  { id: "orange", label: "Operacional", color: "#f97316" },
  { id: "purple", label: "Púrpura", color: "#a855f7" },
  { id: "cyan", label: "Ciano", color: "#06b6d4" },
  { id: "amber", label: "Âmbar", color: "#f59e0b" },
  { id: "violet", label: "Violeta", color: "#8b5cf6" },
  { id: "red", label: "Vermelho", color: "#ef4444" },
]
