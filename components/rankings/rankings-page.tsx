"use client"

import { motion } from "framer-motion"
import { useMemo, useState } from "react"

import { useLocale } from "@/lib/i18n/locale-provider"
import { rankingMessages } from "@/lib/rankings/messages"
import type {
  RankingPeriod,
  RankingScope,
} from "@/lib/rankings/types"

import { MOCK_RANKING_ENTRIES } from "@/mock/rankings"

import { RankingFilters } from "./ranking-filters"
import { RankingPodium } from "./ranking-podium"
import { RankingTable } from "./ranking-table"

export function RankingsPage() {
  const { locale } = useLocale()
  const text = rankingMessages[locale]

  const [period, setPeriod] = useState<RankingPeriod>("weekly")
  const [scope, setScope] = useState<RankingScope>("global")

  const { podiumEntries, rankingEntries } = useMemo(() => {
    const sorted = [...MOCK_RANKING_ENTRIES].sort(
      (a, b) => a.position - b.position
    )

    return {
      podiumEntries: sorted.slice(0, 3),
      rankingEntries: sorted.slice(3),
    }
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="w-full"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Filters */}
        <RankingFilters
          period={period}
          scope={scope}
          labels={text}
          onPeriodChange={setPeriod}
          onScopeChange={setScope}
        />

        {/* Ranking */}
        <section className="mt-5 space-y-3">
          <RankingPodium entries={podiumEntries} />

          <RankingTable
            entries={rankingEntries}
            labels={text}
          />
        </section>
      </div>
    </motion.main>
  )
}