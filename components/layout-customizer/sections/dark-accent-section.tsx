"use client"

import { Check, Moon } from "lucide-react"
import { useLayout } from "@/contexts/layout-context"
import { DARK_ACCENT_OPTIONS } from "@/lib/layout/constants"
import { cn } from "cn"

export function DarkAccentSection() {
  const { darkAccent, setDarkAccent } = useLayout()

  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 text-foreground">
        <Moon className="w-3.5 h-3.5 text-primary" /> Tom do Modo Escuro
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {DARK_ACCENT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setDarkAccent(opt.id)}
            className={cn(
              "flex flex-col items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer",
              darkAccent === opt.id
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "border-border/40 hover:bg-muted/30"
            )}
          >
            <div
              className="w-full aspect-[2/1] rounded-lg shadow-inner flex items-center justify-center border border-white/10"
              style={{ backgroundColor: opt.color }}
            >
              {darkAccent === opt.id && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            <span
              className={cn(
                "text-[8px] font-black uppercase tracking-widest",
                darkAccent === opt.id
                  ? "text-primary"
                  : "text-muted-foreground/70"
              )}
            >
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
