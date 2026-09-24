"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { DEFAULT_LOCALE, messages, type Locale } from "./messages"
const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({ locale: DEFAULT_LOCALE, setLocale: () => undefined })
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  useEffect(() => { const saved = window.localStorage.getItem("papirar-locale") as Locale | null; if (saved && saved in messages) setLocaleState(saved) }, [])
  function setLocale(next: Locale) { setLocaleState(next); window.localStorage.setItem("papirar-locale", next) }
  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
}
export function useLocale() { return useContext(LocaleContext) }
