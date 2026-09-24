"use client"
import { useLocale } from "@/lib/i18n/locale-provider"
import { dashboardMessages } from "@/lib/i18n/messages"
export default function DashboardPage() {
  const { locale } = useLocale(); const text = dashboardMessages[locale]
  return <main className="flex flex-1 flex-col gap-6 p-6"><div><p className="text-sm text-muted-foreground">Papirar</p><h1 className="mt-2 text-2xl font-semibold">{text.dashboard}</h1><p className="mt-1 text-sm text-muted-foreground">{text.overview}</p></div><div className="grid gap-4 md:grid-cols-3"><div className="aspect-video rounded-2xl border border-border bg-muted/40" /><div className="aspect-video rounded-2xl border border-border bg-muted/40" /><div className="aspect-video rounded-2xl border border-border bg-muted/40" /></div></main>
}
