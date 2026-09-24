import { Trophy } from "lucide-react"

export function RankingEmptyState({
  title,
  description,
  label,
}: {
  title: string
  description: string
  label: string
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center border-b border-border/60 px-6 py-14 text-center">
      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-muted/40">
        <Trophy className="size-5 text-muted-foreground" />
      </div>
      <span className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-primary/70 uppercase">
        {label}
      </span>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
