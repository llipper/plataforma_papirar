"use client"

import { motion } from "framer-motion"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import type { RankingEntry } from "@/lib/rankings/types"

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value)
}

type PodiumPlace = 1 | 2 | 3

const podiumConfig: Record<
  PodiumPlace,
  {
    height: string
    width: string
    avatar: string
    border: string
    badge: string
    order: string
  }
> = {
  1: {
    height: "h-[104px] sm:h-[116px]",
    width: "w-[96px] sm:w-[120px]",
    avatar: "size-14 sm:size-16",
    border: "border-amber-400",
    badge: "bg-amber-400 text-black",
    order: "order-2",
  },
  2: {
    height: "h-[76px] sm:h-[86px]",
    width: "w-[88px] sm:w-[112px]",
    avatar: "size-12 sm:size-14",
    border: "border-zinc-400",
    badge: "bg-zinc-300 text-zinc-950",
    order: "order-1",
  },
  3: {
    height: "h-[60px] sm:h-[70px]",
    width: "w-[88px] sm:w-[112px]",
    avatar: "size-12 sm:size-14",
    border: "border-orange-500/80",
    badge: "bg-orange-500 text-white",
    order: "order-3",
  },
}

function PodiumUser({
  entry,
  place,
}: {
  entry: RankingEntry
  place: PodiumPlace
}) {
  const config = podiumConfig[place]
  const isWinner = place === 1

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        delay: place === 1 ? 0 : place === 2 ? 0.08 : 0.16,
        ease: "easeOut",
      }}
      className={`
        ${config.order}
        flex
        min-w-0
        flex-col
        items-center
      `}
    >
      {/* User */}
      <div className="flex min-h-[104px] flex-col items-center justify-end">
        {/* Avatar */}
        <div className="relative">
          <div
            className={`
              rounded-full
              border-2
              bg-background
              p-[3px]
              shadow-sm
              ${config.border}
            `}
          >
            <Avatar className={config.avatar}>
              <AvatarImage
                src={entry.avatarUrl ?? undefined}
                alt={entry.name}
                className="object-cover"
              />

              <AvatarFallback className="text-xs font-semibold">
                {getInitials(entry.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Position */}
          <span
            className={`
              absolute
              -right-1
              -top-1
              flex
              size-5
              items-center
              justify-center
              rounded-full
              border-2
              border-background
              text-[9px]
              font-bold
              shadow-sm
              ${config.badge}
            `}
          >
            {place}
          </span>
        </div>

        {/* Name */}
        <span
          className={`
            mt-2
            max-w-[100px]
            truncate
            text-center
            font-semibold
            text-foreground
            ${isWinner ? "text-xs sm:text-sm" : "text-[11px] sm:text-xs"}
          `}
        >
          {entry.name}
        </span>

        {/* Points */}
        <span className="mt-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
          {formatNumber(entry.points)} pts
        </span>
      </div>

      {/* Podium */}
      <div
        className={`
          relative
          mt-3
          flex
          items-start
          justify-center
          overflow-hidden
          rounded-t-xl
          border-x
          border-t
          border-border/60
          bg-muted/35
          ${config.width}
          ${config.height}
        `}
      >
        {/* subtle highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-foreground/10" />

        <span
          className={`
            mt-3
            select-none
            font-semibold
            leading-none
            tracking-[-0.04em]
            text-foreground/[0.08]
            ${
              isWinner
                ? "text-5xl sm:text-6xl"
                : "text-4xl sm:text-5xl"
            }
          `}
        >
          {place}
        </span>
      </div>
    </motion.div>
  )
}

export function RankingPodium({
  entries,
}: {
  entries: RankingEntry[]
}) {
  const top = [...entries]
    .sort((a, b) => a.position - b.position)
    .slice(0, 3)

  if (top.length < 3) {
    return null
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-border/60
        bg-card
      "
    >
      {/* subtle background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-24
          bg-gradient-to-b
          from-muted/20
          to-transparent
        "
      />

      <div
        className="
          relative
          flex
          h-[230px]
          items-end
          justify-center
          gap-2
          px-3
          pt-5
          sm:h-[245px]
          sm:gap-6
          sm:px-6
        "
      >
        <PodiumUser
          entry={top[1]}
          place={2}
        />

        <PodiumUser
          entry={top[0]}
          place={1}
        />

        <PodiumUser
          entry={top[2]}
          place={3}
        />
      </div>
    </section>
  )
}