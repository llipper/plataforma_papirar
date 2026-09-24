"use client"

import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "cn"

export function AppearanceSection() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 text-foreground">
        <Sun className="w-3.5 h-3.5 text-primary" /> Modo de Exibição
      </h4>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center justify-center gap-2 h-10 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer",
            theme === "light"
              ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20"
              : "border-border/40 hover:bg-muted/50 text-muted-foreground"
          )}
        >
          <Sun className="w-3.5 h-3.5" /> Claro
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center justify-center gap-2 h-10 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer",
            theme === "dark"
              ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20"
              : "border-border/40 hover:bg-muted/50 text-muted-foreground"
          )}
        >
          <Moon className="w-3.5 h-3.5" /> Escuro
        </button>
        <button
          type="button"
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center justify-center gap-2 h-10 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer",
            theme === "system"
              ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20"
              : "border-border/40 hover:bg-muted/50 text-muted-foreground"
          )}
        >
          <Monitor className="w-3.5 h-3.5" /> Auto
        </button>
      </div>
    </div>
  )
}
