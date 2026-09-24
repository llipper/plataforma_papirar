"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import type {
  ContainerWidth,
  DarkAccent,
  FontFamily,
  FontSize,
  InterfaceDensity,
  LayoutConfig,
  LayoutContextProps,
  NavbarBehavior,
  Radius,
  SidebarCollapsible,
  SidebarSide,
  SidebarVariant,
  TransitionType,
  VisualEffects,
} from "@/lib/layout/types"
import {
  DEFAULT_LAYOUT_CONFIG,
  LAYOUT_STORAGE_KEY,
} from "@/lib/layout/constants"

export * from "@/lib/layout/types"
export * from "@/lib/layout/constants"

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Layout States
  const [variant, setVariant] = useState<SidebarVariant>(DEFAULT_LAYOUT_CONFIG.variant)
  const [collapsible, setCollapsible] = useState<SidebarCollapsible>(DEFAULT_LAYOUT_CONFIG.collapsible)
  const [side, setSide] = useState<SidebarSide>(DEFAULT_LAYOUT_CONFIG.side)
  const [contentLayout, setContentLayout] = useState(DEFAULT_LAYOUT_CONFIG.contentLayout)
  const [navbarBehavior, setNavbarBehavior] = useState<NavbarBehavior>(DEFAULT_LAYOUT_CONFIG.navbarBehavior)

  // Theme States
  const [fontSize, setFontSize] = useState<FontSize>(DEFAULT_LAYOUT_CONFIG.fontSize)
  const [radius, setRadius] = useState<Radius>(DEFAULT_LAYOUT_CONFIG.radius)
  const [primaryColor, setPrimaryColor] = useState<string>(DEFAULT_LAYOUT_CONFIG.primaryColor)
  const [fontFamily, setFontFamily] = useState<FontFamily>(DEFAULT_LAYOUT_CONFIG.fontFamily)

  // Advanced Customization States
  const [density, setDensity] = useState<InterfaceDensity>(DEFAULT_LAYOUT_CONFIG.density)
  const [effects, setEffects] = useState<VisualEffects>(DEFAULT_LAYOUT_CONFIG.effects)
  const [containerWidth, setContainerWidth] = useState<ContainerWidth>(DEFAULT_LAYOUT_CONFIG.containerWidth)
  const [darkAccent, setDarkAccent] = useState<DarkAccent>(DEFAULT_LAYOUT_CONFIG.darkAccent)
  const [transition, setTransition] = useState<TransitionType>(DEFAULT_LAYOUT_CONFIG.transition)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LAYOUT_STORAGE_KEY)
      if (saved) {
        const config: Partial<LayoutConfig> = JSON.parse(saved)
        if (config.variant) setVariant(config.variant)
        if (config.collapsible) setCollapsible(config.collapsible)
        if (config.side) setSide(config.side)
        if (config.contentLayout) setContentLayout(config.contentLayout)
        if (config.navbarBehavior) setNavbarBehavior(config.navbarBehavior)
        if (config.fontSize) setFontSize(config.fontSize)
        if (typeof config.radius === "number") setRadius(config.radius as Radius)
        if (config.primaryColor) setPrimaryColor(config.primaryColor)
        if (config.fontFamily) setFontFamily(config.fontFamily)
        if (config.density) setDensity(config.density)
        if (config.effects) setEffects(config.effects)
        if (config.containerWidth) setContainerWidth(config.containerWidth)
        if (config.darkAccent) setDarkAccent(config.darkAccent)
        if (config.transition) setTransition(config.transition)
      }
    } catch (e) {
      console.error("Erro ao carregar configurações de layout", e)
    } finally {
      setMounted(true)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return

    const config: LayoutConfig = {
      variant,
      collapsible,
      side,
      contentLayout,
      navbarBehavior,
      fontSize,
      radius,
      primaryColor,
      fontFamily,
      density,
      effects,
      containerWidth,
      darkAccent,
      transition,
    }
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(config))
    } catch (e) {
      console.error("Erro ao salvar configurações de layout", e)
    }
  }, [
    variant,
    collapsible,
    side,
    contentLayout,
    navbarBehavior,
    fontSize,
    radius,
    primaryColor,
    fontFamily,
    density,
    effects,
    containerWidth,
    darkAccent,
    transition,
    mounted,
  ])

  // Apply CSS Variables & attributes to root element
  useEffect(() => {
    const root = document.documentElement

    // Radius
    root.style.setProperty("--radius", `${radius}rem`)

    // Font Size
    if (fontSize === "sm") root.style.fontSize = "14px"
    else if (fontSize === "base") root.style.fontSize = "16px"
    else if (fontSize === "lg") root.style.fontSize = "18px"

    // Data Attributes
    root.setAttribute("data-density", density)
    root.setAttribute("data-effects", effects)
    root.setAttribute("data-container", containerWidth)
    root.setAttribute("data-dark-accent", darkAccent)
    root.setAttribute("data-transition", transition)

    if (primaryColor === "default") {
      root.removeAttribute("data-theme")
    } else {
      root.setAttribute("data-theme", primaryColor)
    }

    if (fontFamily === "sans") {
      root.removeAttribute("data-font")
    } else {
      root.setAttribute("data-font", fontFamily)
    }
  }, [radius, fontSize, density, effects, containerWidth, darkAccent, transition, primaryColor, fontFamily])

  const resetLayout = () => {
    setVariant(DEFAULT_LAYOUT_CONFIG.variant)
    setCollapsible(DEFAULT_LAYOUT_CONFIG.collapsible)
    setSide(DEFAULT_LAYOUT_CONFIG.side)
    setContentLayout(DEFAULT_LAYOUT_CONFIG.contentLayout)
    setNavbarBehavior(DEFAULT_LAYOUT_CONFIG.navbarBehavior)
    setFontSize(DEFAULT_LAYOUT_CONFIG.fontSize)
    setRadius(DEFAULT_LAYOUT_CONFIG.radius)
    setPrimaryColor(DEFAULT_LAYOUT_CONFIG.primaryColor)
    setFontFamily(DEFAULT_LAYOUT_CONFIG.fontFamily)
    setDensity(DEFAULT_LAYOUT_CONFIG.density)
    setEffects(DEFAULT_LAYOUT_CONFIG.effects)
    setContainerWidth(DEFAULT_LAYOUT_CONFIG.containerWidth)
    setDarkAccent(DEFAULT_LAYOUT_CONFIG.darkAccent)
    setTransition(DEFAULT_LAYOUT_CONFIG.transition)
  }

  return (
    <LayoutContext.Provider
      value={{
        variant,
        setVariant,
        collapsible,
        setCollapsible,
        side,
        setSide,
        contentLayout,
        setContentLayout,
        navbarBehavior,
        setNavbarBehavior,
        fontSize,
        setFontSize,
        radius,
        setRadius,
        primaryColor,
        setPrimaryColor,
        fontFamily,
        setFontFamily,
        density,
        setDensity,
        effects,
        setEffects,
        containerWidth,
        setContainerWidth,
        darkAccent,
        setDarkAccent,
        transition,
        setTransition,
        resetLayout,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}
