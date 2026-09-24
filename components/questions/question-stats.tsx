"use client"

import { BarChart3, Timer, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { QuestionStatsData } from "@/lib/questions/types"

export interface QuestionStatsProps {
  stats: QuestionStatsData
}

export function QuestionStats({ stats }: QuestionStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-xl border border-border/50">
      {/* 1. Taxa de Acerto */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" /> Taxa de Acerto
          </span>
          <span>{stats.correctRate}%</span>
        </div>
        <Progress value={stats.correctRate} className="h-1.5" />
      </div>

      {/* 2. Total de Respostas */}
      <div className="flex items-center gap-3 px-4 md:border-l md:border-r border-border/50">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Respostas</p>
          <p className="text-sm font-bold">{stats.totalAnswers.toLocaleString()}</p>
        </div>
      </div>

      {/* 3. Tempo Médio */}
      <div className="flex items-center gap-3 px-4">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <Timer className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Tempo Médio</p>
          <p className="text-sm font-bold">{stats.averageTimeSeconds ?? 0}s</p>
        </div>
      </div>
    </div>
  )
}
