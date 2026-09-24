"use client"
import * as React from "react"

export type Theme = "light" | "dark" | "system"
export type ThemeContextValue = {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system")
  const [systemTheme, setSystemTheme] = React.useState<"light" | "dark">("light")
  const resolvedTheme = theme === "system" ? systemTheme : theme

  React.useEffect(() => {
    const saved = window.localStorage.getItem("papirar-theme") as Theme | null
    if (saved === "light" || saved === "dark" || saved === "system") {
      setThemeState(saved)
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const update = () => setSystemTheme(media.matches ? "dark" : "light")
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
    document.documentElement.style.colorScheme = resolvedTheme
    window.localStorage.setItem("papirar-theme", theme)
  }, [resolvedTheme, theme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: setThemeState }}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}

export function ThemeHotkey() {
  const context = React.useContext(ThemeContext)
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = typeof event.key === "string" ? event.key.toLowerCase() : ""
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        key !== "d" ||
        (event.target instanceof HTMLElement &&
          (event.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName))) ||
        !context
      ) {
        return
      }
      context.setTheme(context.resolvedTheme === "dark" ? "light" : "dark")
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [context])
  return null
}
