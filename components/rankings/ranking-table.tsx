import type { RankingEntry } from "@/lib/rankings/types"

type RankingTableProps = {
  entries: RankingEntry[]
  labels: {
    points: string
    answered: string
    correct: string
    accuracy: string
  }
}

export function RankingTable({
  entries,
  labels,
}: RankingTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      {/* Header - Desktop */}
      <div
        className="
          hidden
          grid-cols-[56px_minmax(180px,1fr)_120px_120px_110px_130px]
          items-center
          gap-4
          border-b
          border-border/60
          bg-muted/30
          px-5
          py-3
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.08em]
          text-muted-foreground
          sm:grid
        "
      >
        <span>#</span>

        <span>Participante</span>

        <span className="text-right">
          {labels.points}
        </span>

        <span className="text-right">
          {labels.answered}
        </span>

        <span className="text-right">
          {labels.correct}
        </span>

        <span className="text-right">
          {labels.accuracy}
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/50">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`
              group
              relative
              transition-colors
              duration-200

              ${
                entry.isCurrentUser
                  ? "bg-muted/50"
                  : "hover:bg-muted/25"
              }
            `}
          >
            {/* Current user indicator */}
            {entry.isCurrentUser && (
              <div
                className="
                  absolute
                  inset-y-0
                  left-0
                  w-[2px]
                  bg-foreground
                "
              />
            )}

            {/* Desktop */}
            <div
              className="
                hidden
                min-h-[58px]
                grid-cols-[56px_minmax(180px,1fr)_120px_120px_110px_130px]
                items-center
                gap-4
                px-5
                sm:grid
              "
            >
              {/* Position */}
              <span className="text-xs font-semibold text-muted-foreground">
                {entry.position}º
              </span>

              {/* Participant */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`
                      truncate
                      text-sm
                      font-medium
                      ${
                        entry.isCurrentUser
                          ? "font-semibold text-foreground"
                          : "text-foreground"
                      }
                    `}
                  >
                    {entry.name}
                  </span>

                  {entry.isCurrentUser && (
                    <span
                      className="
                        rounded-full
                        border
                        border-border
                        bg-background
                        px-2
                        py-0.5
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-muted-foreground
                      "
                    >
                      Você
                    </span>
                  )}
                </div>
              </div>

              {/* Points */}
              <Metric value={entry.points} />

              {/* Answered */}
              <Metric value={entry.answeredQuestions} />

              {/* Correct */}
              <Metric value={entry.correctAnswers} />

              {/* Accuracy */}
              <div className="flex justify-end">
                <span
                  className="
                    min-w-[48px]
                    rounded-md
                    bg-muted
                    px-2
                    py-1
                    text-center
                    text-xs
                    font-semibold
                    tabular-nums
                    text-foreground
                  "
                >
                  {entry.accuracy}%
                </span>
              </div>
            </div>

            {/* Mobile */}
            <div className="p-4 sm:hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="
                      flex
                      size-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-border
                      bg-muted/40
                      text-xs
                      font-semibold
                      text-muted-foreground
                    "
                  >
                    {entry.position}º
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">
                        {entry.name}
                      </p>

                      {entry.isCurrentUser && (
                        <span
                          className="
                            rounded-full
                            bg-foreground
                            px-1.5
                            py-0.5
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-background
                          "
                        >
                          Você
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatNumber(entry.points)} {labels.points}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-semibold tabular-nums">
                  {entry.accuracy}%
                </span>
              </div>

              <div
                className="
                  mt-4
                  grid
                  grid-cols-3
                  divide-x
                  divide-border/60
                  rounded-xl
                  border
                  border-border/60
                  bg-muted/20
                  py-2.5
                "
              >
                <MobileMetric
                  label={labels.points}
                  value={entry.points}
                />

                <MobileMetric
                  label={labels.answered}
                  value={entry.answeredQuestions}
                />

                <MobileMetric
                  label={labels.correct}
                  value={entry.correctAnswers}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Metric({
  value,
}: {
  value: number
}) {
  return (
    <span
      className="
        text-right
        text-sm
        font-medium
        tabular-nums
        text-muted-foreground
      "
    >
      {formatNumber(value)}
    </span>
  )
}

function MobileMetric({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="flex min-w-0 flex-col items-center px-2">
      <span className="text-xs font-semibold tabular-nums text-foreground">
        {formatNumber(value)}
      </span>

      <span className="mt-0.5 truncate text-[9px] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value)
}