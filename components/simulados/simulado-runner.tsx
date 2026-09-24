"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Clock, FileText } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { SimuladoAnswers, SimuladoItem, SimuladoQuestion } from "@/lib/simulados/types"
import { SimuladoAnswerSheet } from "./simulado-answer-sheet"
import { SimuladoQuestionCard } from "./simulado-question-card"

type SimuladoRunnerProps = {
  simulado: SimuladoItem
  questions: SimuladoQuestion[]
}

export function SimuladoRunner({ simulado, questions }: SimuladoRunnerProps) {
  const [answers, setAnswers] = React.useState<SimuladoAnswers>({})
  const [currentQuestionId, setCurrentQuestionId] = React.useState(questions[0]?.id ?? "")

  const answeredCount = questions.filter((question) => answers[question.id]).length
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0

  function handleSelectQuestion(questionId: string) {
    setCurrentQuestionId(questionId)
    document.getElementById(questionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6">
        <header className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <Link
                href="/dashboard/simulados"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "-ml-2 mb-2 gap-2",
                })}
              >
                <ArrowLeft className="size-4" />
                Voltar
              </Link>

              <p className="text-xs font-medium text-muted-foreground">Simulado em andamento</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {simulado.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {simulado.description}
              </p>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-2 sm:min-w-72">
              <div className="rounded-xl border border-border/70 bg-background/60 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="size-4" />
                  Questões
                </div>
                <p className="mt-1 text-lg font-bold">{questions.length}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/60 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="size-4" />
                  Duração
                </div>
                <p className="mt-1 text-lg font-bold">{simulado.duration}</p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span>{answeredCount} de {questions.length} respondidas</span>
            </div>
            <Progress value={progress} />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                id={question.id}
                onFocusCapture={() => setCurrentQuestionId(question.id)}
                onMouseEnter={() => setCurrentQuestionId(question.id)}
                className="scroll-mt-6"
              >
                <SimuladoQuestionCard
                  question={question}
                  selected={answers[question.id]}
                  onSelect={(questionId, alternative) => {
                    setCurrentQuestionId(questionId)
                    setAnswers((current) => ({
                      ...current,
                      [questionId]: alternative,
                    }))
                  }}
                />
              </div>
            ))}
          </section>

          <SimuladoAnswerSheet
            questions={questions}
            answers={answers}
            currentQuestionId={currentQuestionId}
            onSelectQuestion={handleSelectQuestion}
          />
        </div>
      </div>
    </main>
  )
}
