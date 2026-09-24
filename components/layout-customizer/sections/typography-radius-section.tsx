"use client"

import { useLayout } from "@/contexts/layout-context"
import { FONT_SIZE_OPTIONS, RADIUS_OPTIONS } from "@/lib/layout/constants"
import { cn } from "cn"

export function TypographyRadiusSection() {
  const { fontSize, setFontSize, radius, setRadius } = useLayout()

  return (
    <div className="space-y-6">
      {/* ESCALA DA FONTE */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">
          Escala da Fonte
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {FONT_SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFontSize(opt.id)}
              className={cn(
                "h-10 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer",
                fontSize === opt.id
                  ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                  : "border-border/40 hover:bg-muted/30 text-muted-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* BORDAS (RADIUS) */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">
          Raio das Bordas (Radius)
        </h4>
        <div className="grid grid-cols-6 gap-1.5">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRadius(r.value)}
              className={cn(
                "h-10 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer",
                radius === r.value
                  ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                  : "border-border/40 hover:bg-muted/30 text-muted-foreground"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
