"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Archive, Edit3, FileQuestion, Loader2, MoreHorizontal, Plus, Send } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { QuestionCard } from "@/components/questions/question-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { firebaseAuth } from "@/lib/firebase/client"
import type { AdminQuestionListItem } from "@/lib/questions/admin-repository"
import type { QuestionData, QuestionDifficulty } from "@/lib/questions/types"

type AdminQuestionListProps = {
  status?: string
}

export function AdminQuestionList({ status }: AdminQuestionListProps) {
  const router = useRouter()
  const [items, setItems] = useState<AdminQuestionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)
  const [removeTarget, setRemoveTarget] = useState<AdminQuestionListItem | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const user = firebaseAuth.currentUser
        const token = user ? await user.getIdToken() : null
        const response = await fetch(`/api/admin/questions${status ? `?status=${encodeURIComponent(status)}` : ""}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        })
        const data = await response.json() as { items?: AdminQuestionListItem[]; message?: string }
        if (!response.ok) throw new Error(data.message ?? "Não foi possível carregar as questões.")
        if (!cancelled) setItems(Array.isArray(data.items) ? data.items : [])
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Não foi possível carregar as questões.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [status])

  async function action(item: AdminQuestionListItem, method: "PATCH" | "DELETE", body?: Record<string, unknown>) {
    setBusyId(item.id)
    setError("")
    try {
      const user = firebaseAuth.currentUser
      const token = user ? await user.getIdToken() : null
      const response = await fetch(`/api/admin/questions?id=${encodeURIComponent(item.id)}`, {
        method,
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), "content-type": "application/json" },
        body: method === "PATCH" ? JSON.stringify(body ?? {}) : undefined,
      })
      const data = await response.json() as { message?: string }
      if (!response.ok) throw new Error(data.message ?? "Não foi possível atualizar a questão.")
      setItems((current) => method === "DELETE" ? current.filter((candidate) => candidate.id !== item.id) : current.map((candidate) => candidate.id === item.id ? { ...candidate, status: "published", publishedAt: new Date().toISOString() } : candidate))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível atualizar a questão.")
    } finally {
      setBusyId(null)
      setRemoveTarget(null)
    }
  }

  if (loading) {
    return <Card><CardContent className="flex min-h-64 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 size-4 animate-spin" />Carregando questões...</CardContent></Card>
  }

  if (error) {
    return <Card><CardContent className="flex min-h-64 items-center justify-center text-sm text-destructive">{error}</CardContent></Card>
  }

  if (!items.length) {
    return <Card><CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 text-center"><FileQuestion className="size-8 text-muted-foreground" /><p className="text-sm font-semibold">Nenhuma questão encontrada</p><p className="text-xs text-muted-foreground">As questões salvas nesta visão aparecerão aqui.</p><Link className={cn(buttonVariants({ size: "sm" }))} href="/dashboard/admin/questions/create"><Plus className="size-4" />Criar questão</Link></CardContent></Card>
  }

  return (
    <>
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2">
            <div className="flex items-center gap-2"><Badge variant={item.status === "published" ? "default" : "outline"}>{item.status === "published" ? "Publicada" : item.status === "in_review" ? "Em revisão" : "Rascunho"}</Badge><span className="font-mono text-[11px] text-muted-foreground">{item.code}</span></div>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="sm" disabled={busyId === item.id}><MoreHorizontal className="size-3.5" />Ações</Button>} />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/questions/edit/${item.id}`)}><Edit3 />Editar questão</DropdownMenuItem>
                {item.status !== "published" && <DropdownMenuItem onClick={() => void action(item, "PATCH", { action: "publish" })}><Send />Publicar questão</DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => setRemoveTarget(item)}><Archive />Remover da lista</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <QuestionCard question={toQuestionData(item)} isProfessor editorialStatus={item.status as "draft" | "in_review" | "published"} />
        </div>
      ))}
    </div>
      <AlertDialog open={Boolean(removeTarget)} onOpenChange={(open) => { if (!open) setRemoveTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Remover esta questão?</AlertDialogTitle><AlertDialogDescription>A questão será arquivada e deixará de aparecer para os alunos. O histórico de respostas será preservado.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => removeTarget && void action(removeTarget, "DELETE")}>Remover</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function PublishAllQuestionsButton() {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")

  async function publishAll() {
    setBusy(true)
    setMessage("")
    try {
      const user = firebaseAuth.currentUser
      const token = user ? await user.getIdToken() : null
      const response = await fetch("/api/admin/questions?action=publish-all", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await response.json() as { message?: string; publishedCount?: number }
      if (!response.ok) throw new Error(data.message ?? "Não foi possível publicar as questões.")
      setMessage(`${data.publishedCount ?? 0} questão(ões) publicada(s).`)
      setOpen(false)
      window.location.reload()
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Não foi possível publicar as questões.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="lg" onClick={() => setOpen(true)} disabled={busy}><Send className="size-3.5" />Publicar todos</Button>
      {message && <span className="sr-only" role="status">{message}</span>}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Publicar todas as questões?</AlertDialogTitle><AlertDialogDescription>Todas as questões em rascunho ou em revisão serão publicadas. Questões arquivadas/rejeitadas não serão alteradas.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={() => void publishAll()}>{busy ? "Publicando..." : "Publicar todos"}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function toQuestionData(item: AdminQuestionListItem): QuestionData {
  return {
    id: item.id,
    code: item.code,
    discipline: item.discipline,
    subject: item.subject,
    topic: item.topic,
    supportText: item.supportText,
    questionText: item.questionText,
    alternatives: item.alternatives.map((alternative) => ({
      ...alternative,
      explanation: alternative.explanation ?? undefined,
      reference: alternative.reference ?? undefined,
      tip: alternative.tip ?? undefined,
    })),
    stats: item.stats ?? undefined,
    difficulty: normalizeDifficulty(item.difficulty),
    isUnique: item.isOriginal,
    year: item.year ?? undefined,
    board: item.board,
    institution: item.institution,
    career: item.career,
    educationLevel: item.educationLevel,
    resolution: item.resolution,
    objectives: item.objectives,
    tip: item.tip,
    references: item.references,
    videos: item.videos,
  }
}

function normalizeDifficulty(value: string): QuestionDifficulty {
  const normalized = value.toLowerCase().replace(/\s+/g, "_")
  if (normalized === "facil" || normalized === "fácil") return "facil"
  if (normalized === "dificil" || normalized === "difícil") return "dificil"
  if (normalized === "muito_dificil" || normalized === "muito_difícil") return "muito_dificil"
  return "medio"
}
