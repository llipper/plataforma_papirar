"use client"

import { Check, Palette } from "lucide-react"
import { useLayout } from "@/contexts/layout-context"
import { THEME_PALETTES } from "@/lib/layout/constants"
import { cn } from "cn"

export function PrimaryColorSection() {
  const { primaryColor, setPrimaryColor } = useLayout()

  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 text-foreground">
        <Palette className="w-3.5 h-3.5 text-primary" /> Cor de Destaque
      </h4>
      <div className="grid grid-cols-5 gap-2.5">
        {THEME_PALETTES.map((p) => (
          <button
            key={p.id}
            type="button"
            title={p.label}
            onClick={() => setPrimaryColor(p.id)}
            className={cn(
              "group relative aspect-square rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer",
              primaryColor === p.id
                ? "border-primary scale-110 shadow-xs ring-2 ring-primary/20"
                : "border-transparent hover:scale-105"
            )}
            style={{ backgroundColor: p.color }}
          >
            {primaryColor === p.id && (
              <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
