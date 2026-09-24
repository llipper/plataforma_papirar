"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { buttonVariants } from "@/components/ui/button"
import type { MaterialItem } from "@/lib/materials/types"
import { MaterialCard } from "./material-card"

type MaterialGridProps = {
  materials: MaterialItem[]
  showHeading?: boolean
  headingLabel?: string
  headingTitle?: string
  backHref?: string
  searchPlacement?: "panel" | "heading"
}

export function MaterialGrid({
  materials,
  showHeading = true,
  headingLabel = "Biblioteca",
  headingTitle = "Materiais de estudo",
  backHref,
  searchPlacement = "heading",
}: MaterialGridProps) {
  const [search, setSearch] = React.useState("")
  const query = search.trim().toLowerCase()
  const filtered = React.useMemo(() => {
    if (!query) return materials

    return materials.filter((material) =>
      [
        material.title,
        material.subtitle,
        material.discipline,
        material.topic,
        material.description,
      ].some((value) => value.toLowerCase().includes(query))
    )
  }, [materials, query])

  const searchField = (
    <div className="relative w-full lg:max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar material..."
        className="h-10 bg-background pl-9"
      />
    </div>
  )

  return (
    <section className="space-y-6">
      {showHeading && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 items-end gap-3">
            {backHref && (
              <Link
                href={backHref}
                aria-label="Voltar"
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className: "mb-0.5 shrink-0",
                })}
              >
                <ArrowLeft className="size-4" />
              </Link>
            )}

            <div className="min-w-0 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                {headingLabel}
              </p>
              <h1 className="truncate text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {headingTitle}
              </h1>
            </div>
          </div>

          {searchPlacement === "heading" && searchField}
        </div>
      )}

      {searchPlacement === "panel" && (
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
          {searchField}
        </div>
      )}

        {filtered.length > 0 ? (
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(165px,260px))] justify-start gap-3">
            {filtered.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[260px] w-full flex-col items-center justify-center rounded-[18px] border border-dashed border-border/70 px-6 py-10 text-center">
            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <BookOpen className="size-5" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Nenhum material encontrado
            </h2>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Tente buscar por outro título, disciplina ou assunto.
            </p>
          </div>
        )}
    </section>
  )
}
