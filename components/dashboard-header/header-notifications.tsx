"use client"

import { useLocale } from "@/lib/i18n/locale-provider"
import { messages } from "@/lib/i18n/messages"

export function HeaderNotifications() {
  const { locale } = useLocale()
  const text = messages[locale]

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={text.notifications}
        aria-describedby="notification-preview"
        className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none cursor-pointer"
      >
        0
      </button>

      <div
        id="notification-preview"
        role="status"
        className="pointer-events-none invisible absolute top-11 right-0 z-50 flex w-64 translate-y-1 items-center gap-3 rounded-2xl bg-muted p-3 opacity-0 shadow-sm transition-all duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
      >
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-200 via-rose-300 to-violet-300 text-2xl"
        >
          📚
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground">
            {text.connections}
          </p>
          <p className="truncate text-xs font-medium text-foreground">
            {text.notificationMessage}
          </p>
        </div>
      </div>
    </div>
  )
}
