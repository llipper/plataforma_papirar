"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useQuestionCard } from "@/hooks/use-question-card"
import type {
  QuestionAnswerPayload,
  QuestionAnswerResult,
  QuestionData,
  QuestionReportPayload,
} from "@/lib/questions/types"
import { QuestionActions } from "./question-actions"
import { QuestionAlternatives } from "./question-alternatives"
import { QuestionContent } from "./question-content"
import { QuestionExplanation } from "./question-explanation"
import { QuestionHeader } from "./question-header"
import { QuestionReportModal } from "./question-report-modal"
import { QuestionStats } from "./question-stats"
import { QuestionVideoModal } from "./question-video-modal"

export interface QuestionCardProps {
  question: QuestionData
  isProfessor?: boolean
  editorialStatus?: "draft" | "in_review" | "published"
  initialSelectedOption?: string | null
  onAnswerSubmit?: (
    payload: QuestionAnswerPayload
  ) => Promise<QuestionAnswerResult> | QuestionAnswerResult
  onFavoriteToggle?: (questionId: string) => Promise<boolean> | boolean
  onErrorReasonSelect?: (questionId: string, reason: string) => Promise<void> | void
  onReportSubmit?: (payload: QuestionReportPayload) => Promise<void> | void
  className?: string
}

export function QuestionCard({
  question,
  isProfessor = false,
  editorialStatus,
  initialSelectedOption = null,
  onAnswerSubmit,
  onFavoriteToggle,
  onErrorReasonSelect,
  onReportSubmit,
  className = "",
}: QuestionCardProps) {
  const {
    selectedOption,
    isSubmitted,
    currentStatus,
    excludedOptions,
    selectedReason,
    isSaving,
    isPending,
    submitError,
    revealedQuestion,
    isCorrect,
    showExplanation,
    showStats,
    videoModalOpen,
    reportModalOpen,
    isFavorited,
    handleOptionSelect,
    toggleExcludeOption,
    handleSubmit,
    toggleExplanation,
    toggleStats,
    toggleFavorite,
    handleReasonSelect,
    setVideoModalOpen,
    setReportModalOpen,
    handleReportSubmit,
  } = useQuestionCard({
    question,
    initialSelectedOption,
    onAnswerSubmit,
    onFavoriteToggle,
    onErrorReasonSelect,
    onReportSubmit,
  })
  const displayedQuestion = revealedQuestion ?? question

  return (
    <Card
      className={`hover:shadow-lg transition-shadow border-border/50 overflow-hidden bg-card ${className}`}
    >
      {/* 1. Cabeçalho de Metadados e Contexto */}
      <QuestionHeader
        code={displayedQuestion.code}
        discipline={displayedQuestion.discipline}
        subject={displayedQuestion.subject}
        topic={displayedQuestion.topic}
        supportText={displayedQuestion.supportText}
        difficulty={displayedQuestion.difficulty}
        isUnique={displayedQuestion.isUnique}
        year={displayedQuestion.year}
        board={displayedQuestion.board}
        institution={displayedQuestion.institution}
        career={displayedQuestion.career}
        educationLevel={displayedQuestion.educationLevel}
        userStatus={currentStatus !== "none" ? currentStatus : displayedQuestion.userStatus}
        editorialStatus={editorialStatus}
      />

      {/* 2. Conteúdo Principal da Questão */}
      <CardContent className="pt-8 space-y-8">
        {/* Enunciado — mantém a separação explícita após o texto de apoio */}
        <section
          className={`space-y-3 ${displayedQuestion.supportText ? "border-t border-border/40 pt-6" : ""}`}
          aria-labelledby={`question-statement-${question.id}`}
        >
          <h2
            id={`question-statement-${question.id}`}
            className="text-[10px] font-black uppercase tracking-widest text-primary/60"
          >
            Enunciado
          </h2>
        <QuestionContent questionText={displayedQuestion.questionText} />
        </section>

        {/* Alternativas de Resposta */}
        <QuestionAlternatives
          alternatives={displayedQuestion.alternatives}
          stats={displayedQuestion.stats}
          selectedOption={selectedOption}
          isSubmitted={isSubmitted && !isPending}
          isProfessor={isProfessor}
          excludedOptions={excludedOptions}
          onSelect={handleOptionSelect}
          onToggleExclude={toggleExcludeOption}
        />

        {/* Barra de Ações, Feedback e Ferramentas */}
        <div className="space-y-8">
          <QuestionActions
            isSubmitted={isSubmitted}
            selectedOption={selectedOption}
            isCorrect={isCorrect}
            isProfessor={isProfessor}
            isSaving={isSaving}
            isPending={isPending}
            isFavorited={isFavorited}
            selectedReason={selectedReason}
            showExplanation={showExplanation}
            showStats={showStats}
            commentsCount={displayedQuestion.commentsCount}
            onToggleExplanation={toggleExplanation}
            onToggleStats={toggleStats}
            onShowVideos={() => setVideoModalOpen(true)}
            onReportError={() => setReportModalOpen(true)}
            onSubmit={handleSubmit}
            onToggleFavorite={toggleFavorite}
            onReasonSelect={handleReasonSelect}
          />

          {isPending && !submitError && (
            <p className="text-xs text-muted-foreground" aria-live="polite">
              Atualizando o gabarito e as estatísticas…
            </p>
          )}

          {submitError && (
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {submitError}
            </p>
          )}

          {/* Estatísticas (exibidas sob demanda ou para perfis docentes) */}
          {(showStats || isProfessor) && displayedQuestion.stats && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <QuestionStats stats={displayedQuestion.stats} />
            </div>
          )}

          {/* Gabarito Comentado e Justificativas em Abas */}
          <QuestionExplanation
            resolution={displayedQuestion.resolution}
            objectives={displayedQuestion.objectives}
            tip={displayedQuestion.tip}
            references={displayedQuestion.references}
            alternatives={displayedQuestion.alternatives}
            author={displayedQuestion.author}
            show={showExplanation}
          />
        </div>
      </CardContent>

      {/* 3. Modais Auxiliares */}
      <QuestionVideoModal
        videos={displayedQuestion.videos}
        open={videoModalOpen}
        onOpenChange={setVideoModalOpen}
      />

      <QuestionReportModal
        questionId={displayedQuestion.id}
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        onSubmitReport={handleReportSubmit}
      />
    </Card>
  )
}
