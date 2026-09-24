"use client"

import type { RankingPeriod, RankingScope } from "@/lib/rankings/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function RankingFilters({
  period,
  scope,
  labels,
  onPeriodChange,
  onScopeChange,
}: {
  period: RankingPeriod
  scope: RankingScope
  labels: {
    period: string
    scope: string
    weekly: string
    monthly: string
    allTime: string
    global: string
    career: string
    discipline: string
  }
  onPeriodChange: (value: RankingPeriod) => void
  onScopeChange: (value: RankingScope) => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {labels.scope}
        </span>
        <div className="flex rounded-xl bg-muted/50 p-1">
          {(
            [
              ["global", labels.global],
              ["career", labels.career],
              ["discipline", labels.discipline],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onScopeChange(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${scope === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{labels.period}</span>
        <Select
          value={period}
          onValueChange={(value) => onPeriodChange(value as RankingPeriod)}
        >
          <SelectTrigger className="h-8 w-[130px] rounded-lg px-2 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">{labels.weekly}</SelectItem>
            <SelectItem value="monthly">{labels.monthly}</SelectItem>
            <SelectItem value="all_time">{labels.allTime}</SelectItem>
          </SelectContent>
        </Select>
      </label>
    </div>
  )
}
