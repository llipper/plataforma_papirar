"use client"

import { Sparkles } from "lucide-react"
import { useLayout } from "@/contexts/layout-context"
import {
  DENSITY_OPTIONS,
  EFFECTS_OPTIONS,
  TRANSITION_OPTIONS,
} from "@/lib/layout/constants"
import { cn } from "cn"

export function DensityEffectsSection() {
  const {
    density,
    setDensity,
    effects,
    setEffects,
    transition,
    setTransition,
  } = useLayout()

  return (
    <div className="space-y-6">
      {/* DENSIDADE DA INTERFACE */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">
          Densidade da Interface
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {DENSITY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setDensity(opt.id)}
              className={cn(
                "h-10 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer",
                density === opt.id
                  ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                  : "border-border/40 hover:bg-muted/30 text-muted-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* EFEITOS VISUAIS */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 text-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> Efeitos Visuais
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {EFFECTS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setEffects(opt.id)}
              className={cn(
                "h-10 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer",
                effects === opt.id
                  ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                  : "border-border/40 hover:bg-muted/30 text-muted-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* TRANSIÇÕES */}
      <div className="space-y-3 pb-8">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">
          Fluidez & Transições
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {TRANSITION_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTransition(opt.id)}
              className={cn(
                "h-10 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer",
                transition === opt.id
                  ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                  : "border-border/40 hover:bg-muted/30 text-muted-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
