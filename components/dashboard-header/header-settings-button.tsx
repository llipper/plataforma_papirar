"use client"

import Image from "next/image"
import { LayoutCustomizerSheet } from "@/components/layout-customizer"

export function HeaderSettingsButton() {
  return (
    <LayoutCustomizerSheet
      trigger={
        <button
          type="button"
          aria-label="Configurações de Layout e Tema"
          className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none cursor-pointer"
        >
          <Image
            src="/icons/settings.svg"
            alt=""
            width={18}
            height={18}
            className="size-[18px] opacity-70 transition-all hover:opacity-100 dark:invert"
          />
        </button>
      }
    />
  )
}
