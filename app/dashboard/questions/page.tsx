"use client"

import { onAuthStateChanged, type User } from "firebase/auth"
import { useCallback, useEffect, useState } from "react"

import { MinimalQuestionCard } from "@/components/questions/minimal-question-card"
import { QuestionCard } from "@/components/questions/question-card"
import { QuestionFilter } from "@/components/questions/filter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { firebaseAuth } from "@/lib/firebase/client"
import { questionFilterMessages } from "@/lib/questions/filter/messages"
import type { QuestionAnswerPayload, QuestionAnswerResult, QuestionData } from "@/lib/questions/types"
import { useLocale } from "@/lib/i18n/locale-provider"

type QuestionsResponse = {
  items?: QuestionData[]
  nextCursor?: string | null
  message?: string
}

function normalizeQuestion(question: QuestionData): QuestionData {
  return {
    ...question,
    alternatives: question.alternatives.map((alternative) => ({
      ...alternative,
      isCorrect: false,
    })),
  }
}

export default function QuestionsPage() {
  const { locale } = useLocale()
  const text = questionFilterMessages[locale]
  const [viewMode, setViewMode] = useState<"standard" | "minimal">("standard")
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionData[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState("")

  const loadQuestions = useCallback(async (authUser: User, cursor?: string | null) => {
    const isLoadingMore = Boolean(cursor)
    if (isLoadingMore) setLoadingMore(true)
    else setLoading(true)
    setError("")

    try {
      const token = await authUser.getIdToken()
      const search = new URLSearchParams({ limit: "20" })
      if (cursor) search.set("cursor", cursor)
      const response = await fetch("/api/questions?" + search.toString(), {
        headers: { Authorization: "Bearer " + token },
        cache: "no-store",
      })
      const data = await response.json() as QuestionsResponse
      if (!response.ok) throw new Error(data.message ?? "Não foi possível carregar as questões.")

      const incoming = (data.items ?? []).map(normalizeQuestion)
      setQuestions((current) => {
        const next = isLoadingMore ? [...current, ...incoming] : incoming
        setFilteredQuestions(next)
        return next
      })
      setNextCursor(data.nextCursor ?? null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar as questões.")
    } finally {
      if (isLoadingMore) setLoadingMore(false)
      else setLoading(false)
    }
  }, [])

  useEffect(() => onAuthStateChanged(firebaseAuth, (nextUser) => {
    setUser(nextUser)
    if (nextUser) void loadQuestions(nextUser)
    else setLoading(false)
  }), [loadQuestions])

  const submitAnswer = useCallback(async (payload: QuestionAnswerPayload): Promise<QuestionAnswerResult> => {
    if (!user) throw new Error("Faça login para responder à questão.")
    const token = await user.getIdToken()
    const response = await fetch("/api/questions/" + encodeURIComponent(payload.questionId) + "/answers", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        alternativeId: payload.alternativeId,
        alternativeLetter: payload.alternativeLetter,
        timeSeconds: payload.timeSeconds,
      }),
    })
    const data = await response.json() as { answer?: QuestionAnswerResult; message?: string }
    if (!response.ok || !data.answer) throw new Error(data.message ?? "Não foi possível registrar a resposta.")
    return data.answer
  }, [user])

  return (
    <main className="flex w-full flex-1 flex-col gap-6 p-6">
      <div className="flex justify-end">
        <div className="flex w-fit items-center gap-2 rounded-xl border border-border/60 bg-muted/50 p-1">
          <Button size="sm" variant={viewMode === "standard" ? "default" : "ghost"} className="rounded-lg text-xs" onClick={() => setViewMode("standard")}>Modo Completo</Button>
          <Button size="sm" variant={viewMode === "minimal" ? "default" : "ghost"} className="rounded-lg text-xs" onClick={() => setViewMode("minimal")}>Modo Minimalista</Button>
        </div>
      </div>

      {loading ? (
        <Card><CardContent className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">Carregando questões...</CardContent></Card>
      ) : error ? (
        <Card><CardContent className="flex min-h-64 items-center justify-center text-sm text-destructive">{error}</CardContent></Card>
      ) : (
        <>
          <QuestionFilter questions={questions} onChange={setFilteredQuestions} />
          <section className="space-y-6">
            {filteredQuestions.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">{text.resultEmpty}</p>
            ) : viewMode === "standard" ? (
              filteredQuestions.map((question) => <QuestionCard key={question.id} question={question} onAnswerSubmit={submitAnswer} />)
            ) : (
              filteredQuestions.map((question) => <MinimalQuestionCard key={question.id} question={question} onAnswerSubmit={submitAnswer} />)
            )}
          </section>
          {nextCursor && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => user && loadQuestions(user, nextCursor)} disabled={loadingMore}>
                {loadingMore ? "Carregando..." : "Carregar mais questões"}
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
