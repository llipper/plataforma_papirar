"use client"

import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useLocale } from "@/lib/i18n/locale-provider"
import { messages } from "@/lib/i18n/messages"

const SEARCH_OPTIONS = [
  "Direito Constitucional - Art. 5º",
  "Direito Administrativo - Atos Administrativos",
  "Língua Portuguesa - Concordância Verbal",
  "Raciocínio Lógico - Tabela Verdade",
  "Informática - Segurança da Informação",
]

export function HeaderSearch() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { locale } = useLocale()
  const text = messages[locale]

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  const results = query.trim()
    ? SEARCH_OPTIONS.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_OPTIONS

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {searchOpen ? (
          <motion.input
            key="search-input"
            initial={{ opacity: 0, width: 32 }}
            animate={{ opacity: 1, width: 224 }}
            exit={{ opacity: 0, width: 32 }}
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            aria-label={text.search}
            placeholder={text.search}
            className="h-8 rounded-full border border-border/60 bg-muted px-3 text-xs text-foreground ring-1 ring-transparent outline-none focus:border-border focus:ring-ring/40"
          />
        ) : (
          <motion.button
            key="search-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            aria-label={text.search}
            onClick={() => setSearchOpen(true)}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-muted px-3 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground cursor-pointer"
          >
            <Search className="size-3.5" />
            <span>{text.search}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute top-11 left-0 z-50 w-80 rounded-2xl bg-background p-4 shadow-md ring-1 ring-border/50"
          >
            {results.map((item, index) => (
              <motion.button
                key={item}
                type="button"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-xs hover:bg-muted cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-primary"
                />
                <span className="truncate">{item}</span>
              </motion.button>
            ))}
            {results.length === 0 && (
              <p className="px-4 py-3 text-xs text-muted-foreground">
                {text.noResults}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
