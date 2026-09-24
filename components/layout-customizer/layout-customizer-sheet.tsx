"use client"

import type { ReactElement } from "react"
import { RotateCcw, Sliders } from "lucide-react"
import { useLayout } from "@/contexts/layout-context"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AppearanceSection } from "./sections/appearance-section"
import { DarkAccentSection } from "./sections/dark-accent-section"
import { PrimaryColorSection } from "./sections/primary-color-section"
import { SidebarLayoutSection } from "./sections/sidebar-layout-section"
import { TypographyRadiusSection } from "./sections/typography-radius-section"
import { DensityEffectsSection } from "./sections/density-effects-section"

interface LayoutCustomizerSheetProps {
  trigger: ReactElement
}

export function LayoutCustomizerSheet({ trigger }: LayoutCustomizerSheetProps) {
  const { resetLayout } = useLayout()

  return (
    <Sheet>
      <SheetTrigger render={trigger} />
      <SheetContent
        side="right"
        className="w-[340px] sm:w-[420px] p-0 border-l border-border/40"
      >
        <div className="flex flex-col h-full bg-background">
          {/* HEADER */}
          <SheetHeader className="p-6 border-b border-border/40 shrink-0 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <SheetTitle className="text-xs font-black uppercase tracking-[0.2em]">
                  Personalização & Layout
                </SheetTitle>
              </div>
              <button
                type="button"
                onClick={resetLayout}
                title="Restaurar padrões"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer mr-6"
              >
                <RotateCcw className="w-3 h-3" />
                Padrões
              </button>
            </div>
            <SheetDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
              Ajuste temas, cores, densidade e estrutura da interface.
            </SheetDescription>
          </SheetHeader>

          {/* SECTIONS */}
          <div className="flex-1 overflow-y-auto p-6 space-y-7">
            <AppearanceSection />
            <DarkAccentSection />
            <PrimaryColorSection />
            <SidebarLayoutSection />
            <TypographyRadiusSection />
            <DensityEffectsSection />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
