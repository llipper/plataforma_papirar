"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, BookOpen, Clock, Layers3 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import type { MaterialItem } from "@/lib/materials/types"

type MaterialCardProps = {
  material: MaterialItem
}

export function MaterialCard({ material }: MaterialCardProps) {
  const router = useRouter()

  function openMaterial() {
    router.push(`/dashboard/material/${material.slug}`)
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openMaterial}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          openMaterial()
        }
      }}
      className="group relative flex w-full max-w-[260px] cursor-pointer select-none flex-col rounded-[18px] border border-border/70 bg-card p-2 text-card-foreground shadow-2xs transition-all duration-200 hover:border-border hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-700/80"
    >
      <div className="relative h-[92px] w-full overflow-hidden rounded-[13px] bg-muted">
        {material.imageSrc ? (
          <Image
            src={material.imageSrc}
            alt={material.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 260px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="size-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute left-2.5 top-2.5">
          <Badge variant="secondary" className="rounded-full bg-background/85 px-1.5 py-0 text-[9px] backdrop-blur">
            {material.difficulty}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 px-1 pb-0.5 pt-2">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">
            MATERIAL
          </span>
          <h2 className="mt-0.5 line-clamp-2 text-[13.5px] font-bold leading-[1.25] tracking-tight text-foreground">
            {material.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-[10px] leading-[1.45] text-muted-foreground/80">
            {material.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-1 pt-0.5">
          <div className="flex min-w-0 items-center gap-2 text-[9.5px] text-muted-foreground">
            <span className="inline-flex shrink-0 items-center gap-0.5">
              <Clock className="size-3" />
              {material.duration}
            </span>
            <span className="inline-flex shrink-0 items-center gap-0.5">
              <Layers3 className="size-3" />
              {material.sectionsCount}
            </span>
          </div>

          <Link
            href={`/dashboard/material/${material.slug}`}
            onClick={(event) => event.stopPropagation()}
            className={buttonVariants({
              size: "sm",
              className: "h-7 shrink-0 gap-1 rounded-md px-2 text-[9.5px]",
            })}
          >
            Acessar
            <ArrowRight className="size-2.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
