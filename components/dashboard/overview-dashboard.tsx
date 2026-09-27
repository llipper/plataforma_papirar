"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, BarChart3, BookOpen, CheckCircle2, ChevronRight, FileCheck2, FilePenLine, FilePlus2, Loader2, Send, ShieldCheck, Sparkles } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { firebaseAuth } from "@/lib/firebase/client"
import type { AdminQuestionListItem } from "@/lib/questions/admin-repository"

const chartConfig = { total: { label: "Questões", color: "var(--primary)" } }
const statusMeta = {
  published: { label: "Publicadas", icon: FileCheck2, color: "#34d399" },
  in_review: { label: "Em revisão", icon: ShieldCheck, color: "#fbbf24" },
  draft: { label: "Rascunhos", icon: FilePenLine, color: "#94a3b8" },
} as const

export function OverviewDashboard() {
  const [questions, setQuestions] = useState<AdminQuestionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const user = firebaseAuth.currentUser
        const token = user ? await user.getIdToken() : null
        const response = await fetch("/api/admin/questions", { headers: token ? { Authorization: `Bearer ${token}` } : {}, cache: "no-store" })
        const data = await response.json() as { items?: AdminQuestionListItem[]; message?: string }
        if (!response.ok) throw new Error(data.message ?? "Não foi possível carregar o acervo.")
        if (!cancelled) setQuestions(Array.isArray(data.items) ? data.items : [])
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Não foi possível carregar o acervo.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const counts = useMemo(() => ({
    published: questions.filter((item) => item.status === "published").length,
    in_review: questions.filter((item) => item.status === "in_review").length,
    draft: questions.filter((item) => item.status === "draft").length,
  }), [questions])

  const chartData = (Object.keys(statusMeta) as Array<keyof typeof statusMeta>).map((status) => ({ status: statusMeta[status].label, total: counts[status], fill: statusMeta[status].color }))

  return (
    <div className="relative min-h-full overflow-hidden bg-[radial-gradient(circle_at_80%_0%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_28rem)] px-5 py-6 sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto flex max-w-[1500px] flex-col gap-7">
        <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary"><Sparkles className="size-3.5" />Papirar workspace</div><h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Bom estudo, <span className="text-muted-foreground">vamos avançar.</span></h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Um panorama limpo para você encontrar o próximo passo e manter o acervo em movimento.</p></div>
          <div className="flex flex-wrap gap-2"><Button variant="outline" className="border-border/70 bg-background/50 backdrop-blur" render={<Link href="/dashboard/questions" />}><BookOpen className="size-4" />Explorar questões</Button><Button className="shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_28%,transparent)]" render={<Link href="/dashboard/admin/questions/create" />}><FilePlus2 className="size-4" />Criar questão</Button></div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.45fr_0.55fr]">
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/[0.14] via-card to-card shadow-[0_20px_70px_color-mix(in_oklab,var(--primary)_10%,transparent)]"><div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-primary/15 blur-3xl" /><CardContent className="relative flex min-h-52 flex-col justify-between p-6 sm:p-8"><div><Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">Visão geral</Badge><h2 className="mt-5 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">Tudo o que importa, em um só lugar.</h2><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Acompanhe a curadoria das questões e mantenha o conteúdo pronto para os alunos.</p></div><Link href="/dashboard/admin/questions" className="mt-7 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80">Abrir gestão de questões <ArrowUpRight className="size-4" /></Link></CardContent></Card>
          <Card className="border-border/60 bg-card/70 shadow-none"><CardContent className="flex min-h-52 flex-col justify-between p-6"><div className="flex items-center justify-between"><span className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-2.5 text-emerald-400"><CheckCircle2 className="size-5" /></span><span className="text-xs text-muted-foreground">Status da plataforma</span></div><div><p className="text-2xl font-semibold tracking-tight">Operacional</p><p className="mt-1 text-sm text-muted-foreground">Serviços respondendo normalmente</p></div></CardContent></Card>
        </section>

        {error ? <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Resumo do acervo">{(Object.keys(statusMeta) as Array<keyof typeof statusMeta>).map((status) => { const meta = statusMeta[status]; const Icon = meta.icon; return <Card key={status} className="group border-border/60 bg-card/65 shadow-none transition-colors hover:border-primary/30"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{meta.label}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{loading ? "—" : counts[status]}</p></div><span className="rounded-xl border border-border/70 bg-muted/30 p-3 transition-colors group-hover:border-primary/30 group-hover:bg-primary/10"><Icon className="size-5 text-muted-foreground group-hover:text-primary" /></span></CardContent></Card> })}</section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]"><Card className="border-border/60 bg-card/65 shadow-none"><CardHeader className="flex-row items-start justify-between space-y-0"><div><CardTitle>Estado do acervo</CardTitle><CardDescription>Distribuição operacional das questões cadastradas.</CardDescription></div><span className="rounded-lg border border-border/70 p-2 text-muted-foreground"><BarChart3 className="size-4" /></span></CardHeader><CardContent>{loading ? <div className="flex h-64 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 size-4 animate-spin" />Carregando acervo...</div> : <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={10} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><ChartTooltip cursor={false} content={<ChartTooltipContent />} /><Bar dataKey="total" radius={[6, 6, 0, 0]}>{chartData.map((item) => <Cell key={item.status} fill={item.fill} />)}</Bar></BarChart></ResponsiveContainer></ChartContainer>}</CardContent></Card>
          <Card className="border-border/60 bg-card/65 shadow-none"><CardHeader><CardTitle>Ações rápidas</CardTitle><CardDescription>Atalhos para a rotina editorial.</CardDescription></CardHeader><CardContent className="grid gap-2"><Button variant="outline" className="h-11 justify-between border-border/70 bg-background/30" render={<Link href="/dashboard/admin/questions/draft" />}><span className="flex items-center gap-2"><FilePenLine className="size-4 text-muted-foreground" />Revisar rascunhos</span><ChevronRight className="size-4 text-muted-foreground" /></Button><Button variant="outline" className="h-11 justify-between border-border/70 bg-background/30" render={<Link href="/dashboard/admin/questions/review" />}><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-muted-foreground" />Abrir revisão</span><ChevronRight className="size-4 text-muted-foreground" /></Button><Button variant="outline" className="h-11 justify-between border-border/70 bg-background/30" render={<Link href="/dashboard/admin/questions/published" />}><span className="flex items-center gap-2"><Send className="size-4 text-muted-foreground" />Ver publicadas</span><ChevronRight className="size-4 text-muted-foreground" /></Button></CardContent></Card></section>

        <Card className="border-border/60 bg-card/65 shadow-none"><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle>Questões recentes</CardTitle><CardDescription>Últimos itens carregados no acervo administrativo.</CardDescription></div><Button variant="ghost" size="sm" className="text-muted-foreground" render={<Link href="/dashboard/admin/questions" />}>Ver todas <ArrowUpRight className="size-3.5" /></Button></CardHeader><CardContent className="p-0">{loading ? <div className="flex min-h-24 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 size-4 animate-spin" />Carregando...</div> : questions.length === 0 ? <div className="flex min-h-24 items-center justify-center px-6 text-sm text-muted-foreground">Nenhuma questão cadastrada ainda.</div> : <div className="divide-y divide-border/60">{questions.slice(0, 5).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-muted/20"><div className="min-w-0"><p className="truncate text-sm font-medium">{item.questionText || item.code}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{item.code}</p></div><Badge variant={item.status === "published" ? "default" : "outline"}>{item.status === "published" ? "Publicada" : item.status === "in_review" ? "Em revisão" : "Rascunho"}</Badge></div>)}</div>}</CardContent></Card>
        <p className="text-center text-xs text-muted-foreground/70">Visão geral operacional · desempenho e evolução dos alunos ficam na área de Estatísticas.</p>
      </div>
    </div>
  )
}
