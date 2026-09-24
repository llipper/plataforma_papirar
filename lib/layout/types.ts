export type SidebarVariant = "sidebar" | "floating" | "inset"
export type SidebarCollapsible = "offcanvas" | "icon" | "none"
export type SidebarSide = "left" | "right"
export type ContentLayout = "full" | "centered"
export type NavbarBehavior = "relative" | "sticky"
export type FontSize = "sm" | "base" | "lg"
export type Radius = 0 | 0.3 | 0.5 | 0.625 | 0.75 | 1.0
export type FontFamily = "sans" | "mono" | "serif" | "inter" | "roboto"

export type InterfaceDensity =
  | "ultra-compact"
  | "compact"
  | "default"
  | "comfortable"
  | "spacious"

export type VisualEffects =
  | "minimalist"
  | "glass"
  | "frosted"
  | "soft"
  | "matte"
  | "neon"
  | "cyber"

export type ContainerWidth = "fluid" | "focused"

export type DarkAccent =
  | "midnight"
  | "black"
  | "slate"
  | "graphite"
  | "navy"
  | "arctic"

export type TransitionType =
  | "none"
  | "fast"
  | "smooth"
  | "slow"
  | "bounce"
  | "cinematic"

export interface LayoutConfig {
  variant: SidebarVariant
  collapsible: SidebarCollapsible
  side: SidebarSide
  contentLayout: ContentLayout
  navbarBehavior: NavbarBehavior
  fontSize: FontSize
  radius: Radius
  primaryColor: string
  fontFamily: FontFamily
  density: InterfaceDensity
  effects: VisualEffects
  containerWidth: ContainerWidth
  darkAccent: DarkAccent
  transition: TransitionType
}

export interface LayoutContextProps extends LayoutConfig {
  setVariant: (variant: SidebarVariant) => void
  setCollapsible: (collapsible: SidebarCollapsible) => void
  setSide: (side: SidebarSide) => void
  setContentLayout: (layout: ContentLayout) => void
  setNavbarBehavior: (behavior: NavbarBehavior) => void
  setFontSize: (size: FontSize) => void
  setRadius: (radius: Radius) => void
  setPrimaryColor: (color: string) => void
  setFontFamily: (font: FontFamily) => void
  setDensity: (density: InterfaceDensity) => void
  setEffects: (effects: VisualEffects) => void
  setContainerWidth: (width: ContainerWidth) => void
  setDarkAccent: (accent: DarkAccent) => void
  setTransition: (transition: TransitionType) => void
  resetLayout: () => void
}
