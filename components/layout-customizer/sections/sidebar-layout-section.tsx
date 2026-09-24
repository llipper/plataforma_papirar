"use client"

import { Check } from "lucide-react"
import { useLayout } from "@/contexts/layout-context"
import { SIDEBAR_VARIANT_OPTIONS } from "@/lib/layout/constants"
import { cn } from "cn"

export function SidebarLayoutSection() {
  const {
    variant,
    setVariant,
    side,
    setSide,
    containerWidth,
    setContainerWidth,
  } = useLayout()

  return (
    <div className="space-y-6">
      {/* ESTILO DA BARRA */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">
          Estilo da Barra Lateral
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {SIDEBAR_VARIANT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setVariant(opt.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer",
                variant === opt.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border/40 hover:bg-muted/30"
              )}
            >
              <div className="w-full aspect-[4/3] rounded bg-muted/40 flex items-center justify-center relative overflow-hidden">
                <div
                  className={cn(
                    "absolute left-0 top-0 h-full w-2.5 bg-primary/30",
                    opt.id === "floating" && "left-1 top-1 h-[75%] rounded-xs",
                    opt.id === "inset" && "left-1 top-1 h-[85%] rounded-xs"
                  )}
                />
                {variant === opt.id && (
                  <Check className="w-3.5 h-3.5 text-primary z-10" />
                )}
              </div>
              <span
                className={cn(
                  "text-[8px] font-black uppercase tracking-widest",
                  variant === opt.id
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

      {/* POSIÇÃO DA BARRA */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">
          Posição da Barra Lateral
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSide("left")}
            className={cn(
              "flex flex-col items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer",
              side === "left"
                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                : "border-border/40 hover:bg-muted/30 text-muted-foreground"
            )}
          >
            <div className="w-full aspect-video rounded bg-muted/40 flex items-start justify-start p-1">
              <div className="h-full w-2 bg-primary/40 rounded-full" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">
              Esquerda
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSide("right")}
            className={cn(
              "flex flex-col items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer",
              side === "right"
                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                : "border-border/40 hover:bg-muted/30 text-muted-foreground"
            )}
          >
            <div className="w-full aspect-video rounded bg-muted/40 flex items-start justify-end p-1">
              <div className="h-full w-2 bg-primary/40 rounded-full" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">
              Direita
            </span>
          </button>
        </div>
      </div>

      {/* LARGURA DO CONTEÚDO */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">
          Largura do Conteúdo
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setContainerWidth("fluid")}
            className={cn(
              "flex flex-col items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer",
              containerWidth === "fluid"
                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                : "border-border/40 hover:bg-muted/30 text-muted-foreground"
            )}
          >
            <div className="w-full aspect-video rounded bg-muted/40 flex items-center justify-center px-2">
              <div className="h-2 w-full bg-primary/40 rounded-full" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">
              Total (Fluido)
            </span>
          </button>
          <button
            type="button"
            onClick={() => setContainerWidth("focused")}
            className={cn(
              "flex flex-col items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer",
              containerWidth === "focused"
                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                : "border-border/40 hover:bg-muted/30 text-muted-foreground"
            )}
          >
            <div className="w-full aspect-video rounded bg-muted/40 flex items-center justify-center px-2">
              <div className="h-2 w-1/2 bg-primary/40 rounded-full" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">
              Focado (Centralizado)
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
