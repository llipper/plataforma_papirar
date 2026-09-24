"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Bold, Check, ChevronLeft, ChevronRight, Eye, FileImage, Italic, LayoutList, List, ListOrdered, Loader2, Plus, Save, Trash2, Underline, Video } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FilterSelect } from "@/components/questions/filter/filter-select"
import { firebaseAuth } from "@/lib/firebase/client"
import type { AdminQuestionListItem } from "@/lib/questions/admin-repository"
import type { QuestionAnswerFormat, TaxonomyItem } from "@/lib/taxonomies/types"

type AlternativeDraft = {
  letter: string
  content: string
  explanation: string
  referenceText: string
  tip: string
  isCorrect: boolean
}

type VideoDraft = {
  title: string
  url: string
  durationMinutes: string
}

const letters = ["A", "B", "C", "D", "E"]

async function authHeaders() {
  const user = firebaseAuth.currentUser
  const headers: Record<string, string> = {}
  if (user) headers.Authorization = `Bearer ${await user.getIdToken()}`
  return headers
}

function richTextToPlainText(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").trim()
}

function escapeHtmlAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  )
}

function SectionHeading({ number, title, description }: { number: string; title: string; description?: string }) {
  return (
    <div className="flex items-start gap-3 px-1">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">{number}</span>
      <div>
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = "min-h-32",
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  minHeight?: string
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [activeMarks, setActiveMarks] = useState({ bold: false, italic: false, underline: false, unorderedList: false, orderedList: false })

  useEffect(() => {
    const editor = editorRef.current
    if (editor && editor.innerHTML !== value) editor.innerHTML = value
  }, [value])

  function refreshMarks() {
    setActiveMarks({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      unorderedList: document.queryCommandState("insertUnorderedList"),
      orderedList: document.queryCommandState("insertOrderedList"),
    })
  }

  function command(commandName: string, commandValue?: string) {
    editorRef.current?.focus()
    document.execCommand(commandName, false, commandValue)
    if (editorRef.current) onChange(editorRef.current.innerHTML)
    refreshMarks()
  }

  const toolbarButton = (active: boolean) => `inline-flex size-8 items-center justify-center rounded-md border transition-colors ${active ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"}`

  return (
    <div className="overflow-hidden rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring/20">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/20 p-1.5">
        <button type="button" className={toolbarButton(activeMarks.bold)} aria-label="Negrito" aria-pressed={activeMarks.bold} onMouseDown={(event) => event.preventDefault()} onClick={() => command("bold")}><Bold className="size-4" /></button>
        <button type="button" className={toolbarButton(activeMarks.italic)} aria-label="Itálico" aria-pressed={activeMarks.italic} onMouseDown={(event) => event.preventDefault()} onClick={() => command("italic")}><Italic className="size-4" /></button>
        <button type="button" className={toolbarButton(activeMarks.underline)} aria-label="Sublinhado" aria-pressed={activeMarks.underline} onMouseDown={(event) => event.preventDefault()} onClick={() => command("underline")}><Underline className="size-4" /></button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" className={toolbarButton(activeMarks.unorderedList)} aria-label="Lista com marcadores" aria-pressed={activeMarks.unorderedList} onMouseDown={(event) => event.preventDefault()} onClick={() => command("insertUnorderedList")}><List className="size-4" /></button>
        <button type="button" className={toolbarButton(activeMarks.orderedList)} aria-label="Lista numerada" aria-pressed={activeMarks.orderedList} onMouseDown={(event) => event.preventDefault()} onClick={() => command("insertOrderedList")}><ListOrdered className="size-4" /></button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        className={`relative whitespace-pre-wrap p-3 text-sm outline-none empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)] ${minHeight}`}
        onInput={(event) => { onChange(event.currentTarget.innerHTML); refreshMarks() }}
        onKeyUp={refreshMarks}
        onMouseUp={refreshMarks}
        onFocus={refreshMarks}
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ id: string; title: string; subtitle?: string; examYear?: number | null; uf?: string | null; stateName?: string | null }>
  placeholder: string
  required?: boolean
  disabled?: boolean
}) {
  return (
    <FilterSelect
      label={`${label}${required ? " *" : ""}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      options={options.map((option) => ({
        value: option.id,
        label: `${option.title}${[option.subtitle, option.examYear ? String(option.examYear) : null, option.uf ?? option.stateName].filter(Boolean).length ? ` · ${[option.subtitle, option.examYear ? String(option.examYear) : null, option.uf ?? option.stateName].filter(Boolean).join(" · ")}` : ""}`,
      }))}
    />
  )
}

export function CreateQuestionForm({ questionId }: { questionId?: string }) {
  const router = useRouter()
  const [taxonomies, setTaxonomies] = useState<Record<string, TaxonomyItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [disciplineId, setDisciplineId] = useState("")
  const [subjectId, setSubjectId] = useState("")
  const [topicId, setTopicId] = useState("")
  const [subtopicId, setSubtopicId] = useState("")
  const [difficultyId, setDifficultyId] = useState("")
  const [educationLevelId, setEducationLevelId] = useState("")
  const [examBoardId, setExamBoardId] = useState("")
  const [examId, setExamId] = useState("")
  const [positionId, setPositionId] = useState("")
  const [questionTypeId, setQuestionTypeId] = useState("")
  const [isOriginal, setIsOriginal] = useState(true)
  const [statement, setStatement] = useState("")
  const [supportText, setSupportText] = useState("")
  const [resolution, setResolution] = useState("")
  const [tip, setTip] = useState("")
  const [objectives, setObjectives] = useState([""])
  const [references, setReferences] = useState([""])
  const [videos, setVideos] = useState<VideoDraft[]>([])
  const [supportImageUrl, setSupportImageUrl] = useState("")
  const [supportImageAlt, setSupportImageAlt] = useState("")
  const [visibility, setVisibility] = useState<"private" | "organization" | "public">("public")
  const [allowComments, setAllowComments] = useState(true)
  const [reviewMode, setReviewMode] = useState(false)
  const [status, setStatus] = useState<"draft" | "in_review" | "published">("draft")
  const [alternatives, setAlternatives] = useState<AlternativeDraft[]>([])
  const [wizardMode, setWizardMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const submitIntent = useRef<"draft" | "published" | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const headers = await authHeaders()
        const kinds = ["subjects", "careers", "difficulty", "education", "boards", "question-types"]
        const responses = await Promise.all(
          kinds.map(async (kind) => {
            const response = await fetch(`/api/admin/taxonomies/${kind}`, { headers, cache: "no-store" })
            if (!response.ok) throw new Error(`Não foi possível carregar ${kind}.`)
            const data = await response.json() as { items?: TaxonomyItem[] }
            return [kind, Array.isArray(data.items) ? data.items : []] as const
          })
        )
        if (!cancelled) setTaxonomies(Object.fromEntries(responses))
        if (questionId) {
          const questionResponse = await fetch(`/api/admin/questions?id=${encodeURIComponent(questionId)}`, { headers, cache: "no-store" })
          const questionData = await questionResponse.json() as { items?: AdminQuestionListItem[] }
          const item = questionData.items?.[0]
          if (!questionResponse.ok || !item) throw new Error("Não foi possível carregar a questão para edição.")
          setDisciplineId(item.disciplineId); setSubjectId(item.subjectId ?? ""); setTopicId(item.topicId ?? ""); setSubtopicId(item.subtopicId ?? "")
          setDifficultyId(item.difficultyId); setQuestionTypeId(item.questionTypeId); setEducationLevelId(item.educationLevelId ?? ""); setExamBoardId(item.examBoardId ?? ""); setExamId(item.examId ?? ""); setPositionId(item.positionIds?.[0] ?? "")
          setIsOriginal(item.isOriginal); setSupportText(item.supportText ?? ""); setStatement(item.questionText); setResolution(item.resolution ?? ""); setTip(item.tip ?? ""); setObjectives(item.objectives?.length ? item.objectives : [""]); setReferences(item.references?.length ? item.references : [""]); setVisibility(item.visibility === "private" || item.visibility === "organization" ? item.visibility : "public"); setAllowComments(item.allowComments); setReviewMode(item.reviewMode); setStatus(item.status === "published" ? "published" : item.status === "in_review" ? "in_review" : "draft")
          setAlternatives(item.alternatives.map((alternative) => ({ letter: alternative.letter, content: alternative.text, explanation: alternative.explanation ?? "", referenceText: alternative.reference ?? "", tip: alternative.tip ?? "", isCorrect: alternative.isCorrect })))
        }
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Não foi possível carregar as opções.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [questionId])

  const subjects = taxonomies.subjects ?? []
  const careers = taxonomies.careers ?? []
  const selectedType = (taxonomies["question-types"] ?? []).find((item) => item.id === questionTypeId)
  const format = selectedType?.answerFormat as QuestionAnswerFormat | null | undefined
  const disciplines = subjects.filter((item) => item.level === "disciplina")
  const subjectOptions = subjects.filter((item) => item.level === "assunto" && item.parentId === disciplineId)
  const topicOptions = subjects.filter((item) => item.level === "topico" && item.parentId === subjectId)
  const subtopicOptions = subjects.filter((item) => item.level === "subtopico" && item.parentId === topicId)
  const exams = careers.filter((item) => item.level === "concurso")
  const positions = careers.filter((item) => item.level === "cargo" && item.parentId === examId)

  const typeOptions = useMemo(
    () => (taxonomies["question-types"] ?? []).filter((item) => item.level === "tipoQuestao"),
    [taxonomies]
  )

  function updateType(id: string) {
    setQuestionTypeId(id)
    const type = typeOptions.find((item) => item.id === id)
    const nextFormat = type?.answerFormat
    const count = nextFormat === "multiple_choice" ? (type?.alternativeCount ?? 5) : nextFormat === "true_false" ? 2 : 0
    setAlternatives(Array.from({ length: count }, (_, index) => ({
      letter: nextFormat === "true_false" ? ["C", "E"][index] : letters[index],
      content: nextFormat === "true_false" ? ["Certo", "Errado"][index] : "",
      explanation: "",
      referenceText: "",
      tip: "",
      isCorrect: false,
    })))
  }

  function updateAlternative(index: number, patch: Partial<AlternativeDraft>) {
    const { isCorrect, ...contentPatch } = patch
    setAlternatives((current) => current.map((alternative, alternativeIndex) => ({
      ...alternative,
      ...contentPatch,
      ...(isCorrect === true ? { isCorrect: alternativeIndex === index } : {}),
    })))
  }

  function requestSubmit(intent: "draft" | "published") {
    submitIntent.current = intent
    setStatus(intent)
    if (intent === "published") setReviewMode(false)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!richTextToPlainText(statement)) {
      setError("O enunciado é obrigatório.")
      return
    }
    setSaving(true)
    setError("")
    setSuccess("")
    try {
      const requestedStatus = submitIntent.current ?? status
      submitIntent.current = null
      const effectiveStatus = requestedStatus === "published" ? "published" : reviewMode ? "in_review" : requestedStatus
      const supportContent = supportImageUrl.trim()
        ? `${supportText}${supportText ? "<p>" : ""}<img src="${escapeHtmlAttribute(supportImageUrl.trim())}" alt="${escapeHtmlAttribute(supportImageAlt.trim() || "Imagem de apoio")}" />${supportText ? "</p>" : ""}`
        : supportText
      const response = await fetch(questionId ? `/api/admin/questions?id=${encodeURIComponent(questionId)}` : "/api/admin/questions", {
        method: questionId ? "PATCH" : "POST",
        headers: { ...(await authHeaders()), "content-type": "application/json" },
        body: JSON.stringify({
          disciplineId,
          subjectId: subjectId || null,
          topicId: topicId || null,
          subtopicId: subtopicId || null,
          difficultyId,
          questionTypeId,
          educationLevelId: educationLevelId || null,
          examBoardId: examBoardId || null,
          examId: examId || null,
          positionIds: positionId ? [positionId] : [],
          isOriginal,
          statement,
          supportText: supportContent,
          resolution,
          tip,
          objectives: objectives.map((value) => value.trim()).filter(Boolean),
          references: references.map((value) => value.trim()).filter(Boolean),
          visibility,
          allowComments,
          reviewMode,
          status: effectiveStatus,
          videos: videos
            .filter((video) => video.title.trim() && video.url.trim())
            .map((video) => ({ title: video.title, url: video.url, durationSeconds: video.durationMinutes ? Number(video.durationMinutes) * 60 : null })),
          alternatives: format === "free_text" ? [] : alternatives,
        }),
      })
      const data = await response.json() as { question?: { code: string }; message?: string }
      if (!response.ok) throw new Error(data.message ?? "Não foi possível salvar a questão.")
      setSuccess(`Questão ${data.question?.code ?? ""} salva com sucesso.`)
      if (effectiveStatus === "published") setTimeout(() => router.push("/dashboard/admin/questions/published"), 700)
      if (effectiveStatus === "in_review") setTimeout(() => router.push("/dashboard/admin/questions/review"), 700)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível salvar a questão.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-96 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 size-4 animate-spin" />Carregando classificações...</div>
  }

  return (
    <form id="question-create-form" onSubmit={submit} className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pb-20 pt-0">
      <header className="sticky top-0 z-30 -mx-4 flex min-h-14 flex-wrap items-center justify-between gap-3 border-b bg-background/95 px-4 py-2 backdrop-blur">
        <div>
          <p className="text-[11px] text-muted-foreground">Gestão de Questões</p>
          <h1 className="text-base font-semibold tracking-tight">{questionId ? "Editar Questão" : "Criar Questão"}</h1>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => router.push("/dashboard/admin/questions")}>Cancelar</Button>
          <Button type="submit" variant="ghost" size="sm" disabled={saving} onClick={() => requestSubmit("draft")}>{saving ? "Salvando..." : "Salvar rascunho"}</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("question-preview")?.scrollIntoView({ behavior: "smooth" })}><Eye className="size-3.5" />Pré-visualizar</Button>
          <Button type="submit" size="sm" disabled={saving} onClick={() => requestSubmit("published")}>{saving ? <Loader2 className="animate-spin" /> : <Save />} Publicar agora</Button>
        </div>
      </header>

      {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600"><Check className="mr-2 inline size-4" />{success}</div>}

      <div className="flex flex-col items-center justify-between gap-3 border-t pt-4 md:flex-row">
        <div className="flex items-center gap-1 rounded-xl border bg-muted/30 p-1">
          <Button type="button" size="sm" variant={!wizardMode ? "secondary" : "ghost"} onClick={() => setWizardMode(false)}><LayoutList className="size-3.5" />Visão geral</Button>
          <Button type="button" size="sm" variant={wizardMode ? "secondary" : "ghost"} onClick={() => setWizardMode(true)}><ListOrdered className="size-3.5" />Passo a passo</Button>
        </div>
        {wizardMode && <div className="text-xs text-muted-foreground">Etapa {currentStep} de 7</div>}
      </div>

      {(!wizardMode || currentStep === 1) && <section className="space-y-3">
        <SectionHeading number="01" title="Classificação" description="Organize a questão na estrutura de conteúdo e concurso." />
        <Card><CardContent className="space-y-4 p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <SelectField label="Disciplina" required value={disciplineId} onChange={(value) => { setDisciplineId(value); setSubjectId(""); setTopicId(""); setSubtopicId("") }} options={disciplines} placeholder="Selecione a disciplina" />
          <SelectField label="Assunto" value={subjectId} onChange={(value) => { setSubjectId(value); setTopicId(""); setSubtopicId("") }} options={subjectOptions} placeholder="Opcional" disabled={!disciplineId} />
          <SelectField label="Tópico" value={topicId} onChange={(value) => { setTopicId(value); setSubtopicId("") }} options={topicOptions} placeholder="Opcional" disabled={!subjectId} />
          <SelectField label="Subtópico" value={subtopicId} onChange={setSubtopicId} options={subtopicOptions} placeholder="Opcional" disabled={!topicId} />
          <SelectField label="Tipo de questão" required value={questionTypeId} onChange={updateType} options={typeOptions.map((item) => ({ ...item, subtitle: item.answerFormat === "multiple_choice" ? `${item.alternativeCount} alternativas` : item.answerFormat === "true_false" ? "Certo ou errado" : "Discursiva" }))} placeholder="Selecione o tipo" />
          </div>
          <div className="grid gap-4 border-t pt-4 md:grid-cols-2 lg:grid-cols-5">
          <SelectField label="Dificuldade" required value={difficultyId} onChange={setDifficultyId} options={taxonomies.difficulty ?? []} placeholder="Selecione a dificuldade" />
          <SelectField label="Nível educacional" value={educationLevelId} onChange={setEducationLevelId} options={taxonomies.education ?? []} placeholder="Opcional" />
          <SelectField label="Banca examinadora" value={examBoardId} onChange={setExamBoardId} options={taxonomies.boards ?? []} placeholder="Opcional" />
          <SelectField label="Concurso de origem" value={examId} onChange={setExamId} options={exams} placeholder="Questão autoral ou selecione" />
          <SelectField label="Cargo" value={positionId} onChange={setPositionId} options={positions} placeholder="Opcional" disabled={!examId} />
          </div>
          <div className="border-t pt-4">
          <label className="flex items-center gap-2 self-end pb-1 text-xs"><input type="checkbox" checked={isOriginal} onChange={(event) => setIsOriginal(event.target.checked)} /> Questão inédita</label>
          </div>
        </CardContent>
        </Card>
      </section>}

      {(!wizardMode || currentStep === 2) && <section className="space-y-3">
        <SectionHeading number="02" title="Enunciado" description="Escreva o contexto e o comando que serão apresentados ao aluno." />
        <Card><CardContent className="space-y-4 p-4">
          <Field label="Texto de apoio"><RichTextEditor value={supportText} onChange={setSupportText} placeholder="Texto, lei ou contexto associado à questão..." minHeight="min-h-28" /></Field>
          <Field label="Enunciado" required><RichTextEditor value={statement} onChange={setStatement} placeholder="Digite o enunciado da questão..." minHeight="min-h-40" /></Field>
        </CardContent>
        </Card>
      </section>}

      {(!wizardMode || currentStep === 3) && format !== "free_text" && alternatives.length > 0 && (
        <section className="space-y-3">
          <SectionHeading number="03" title="Alternativas e gabarito" description="Defina as opções e marque a resposta correta." />
          <Card><CardContent className="space-y-2 p-4">
            {alternatives.map((alternative, index) => (
              <div key={alternative.letter} className={`flex items-start gap-3 rounded-md border p-3 ${alternative.isCorrect ? "border-emerald-500/60 bg-emerald-500/5" : "border-border"}`}>
                <button type="button" aria-label={`Marcar alternativa ${alternative.letter} como correta`} onClick={() => updateAlternative(index, { isCorrect: true })} className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${alternative.isCorrect ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/40 text-muted-foreground"}`}>{alternative.isCorrect ? <Check className="size-3" /> : alternative.letter}</button>
                <Textarea required value={alternative.content} onChange={(event) => updateAlternative(index, { content: event.target.value })} placeholder={`Texto da alternativa ${alternative.letter}`} rows={2} />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Clique na letra para definir o gabarito. A questão deve ter exatamente uma alternativa correta.</p>
          </CardContent></Card>
        </section>
      )}

      {(!wizardMode || currentStep === 3) && format === "free_text" && <section className="space-y-3"><SectionHeading number="03" title="Resposta" description="Questões discursivas não possuem alternativas." /><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">A resposta será avaliada posteriormente.</p></CardContent></Card></section>}

      {(!wizardMode || currentStep === 4) && <section className="space-y-3">
        <SectionHeading number="04" title="Resolução e gabarito comentado" description="Explique o raciocínio completo da resposta correta." />
        <Card><CardContent className="p-4">
          <Field label="Comentário do professor / gabarito comentado"><RichTextEditor value={resolution} onChange={setResolution} placeholder="Explique o raciocínio e o fundamento da resposta..." minHeight="min-h-48" /></Field>
        </CardContent></Card>
      </section>}

      {(!wizardMode || currentStep === 5) && format !== "free_text" && <section className="space-y-3">
        <SectionHeading number="05" title="Explicações das alternativas" description="Explique por que a alternativa correta está correta e por que cada distrator está errado." />
        <Card><CardContent className="space-y-4 p-4">
          {alternatives.map((alternative) => (
            <div key={alternative.letter} className="space-y-3 rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm font-medium"><span className={`flex size-6 items-center justify-center rounded-full border text-xs ${alternative.isCorrect ? "border-emerald-500 bg-emerald-500 text-white" : ""}`}>{alternative.letter}</span>{alternative.isCorrect ? "Por que esta alternativa está correta?" : "Por que esta alternativa está incorreta?"}</div>
              <Textarea value={alternative.explanation} onChange={(event) => updateAlternative(alternatives.indexOf(alternative), { explanation: event.target.value })} placeholder={alternative.isCorrect ? `Explique tecnicamente por que a alternativa ${alternative.letter} é o gabarito...` : `Explique tecnicamente por que a alternativa ${alternative.letter} está errada...`} rows={3} />
              <div className="grid gap-3 md:grid-cols-2"><Input value={alternative.referenceText} onChange={(event) => updateAlternative(alternatives.indexOf(alternative), { referenceText: event.target.value })} placeholder="Referência da alternativa (opcional)" /><Input value={alternative.tip} onChange={(event) => updateAlternative(alternatives.indexOf(alternative), { tip: event.target.value })} placeholder="Dica da alternativa (opcional)" /></div>
            </div>
          ))}
        </CardContent></Card>
      </section>}

      {(!wizardMode || currentStep === 6) && <section className="space-y-3">
        <SectionHeading number="06" title="Materiais de apoio e macetes" description="Adicione objetivos, referências, dicas, vídeos e imagem de apoio." />
        <Card><CardContent className="space-y-5 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between"><Label>Objetivos pedagógicos</Label><Button type="button" variant="outline" size="sm" onClick={() => setObjectives((current) => [...current, ""])}><Plus className="size-3.5" />Adicionar objetivo</Button></div>
            {objectives.map((objectiveValue, index) => <div key={`objective-${index}`} className="flex gap-2"><Input value={objectiveValue} onChange={(event) => setObjectives((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} placeholder="O que o aluno deve dominar?" />{objectives.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => setObjectives((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="size-4" /></Button>}</div>)}
          </div>
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between"><Label>Referências bibliográficas</Label><Button type="button" variant="outline" size="sm" onClick={() => setReferences((current) => [...current, ""])}><Plus className="size-3.5" />Adicionar referência</Button></div>
            {references.map((referenceValue, index) => <div key={`reference-${index}`} className="flex gap-2"><Input value={referenceValue} onChange={(event) => setReferences((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} placeholder="Lei, artigo ou bibliografia" />{references.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => setReferences((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="size-4" /></Button>}</div>)}
          </div>
          <div className="grid gap-4 border-t pt-4 md:grid-cols-2"><Field label="Bizu / dica"><Textarea value={tip} onChange={(event) => setTip(event.target.value)} placeholder="Atalho importante para a prova..." rows={4} /></Field><Field label="Imagem de apoio (URL)" ><div className="space-y-2"><div className="flex items-center gap-2"><FileImage className="size-4 text-muted-foreground" /><Input value={supportImageUrl} onChange={(event) => setSupportImageUrl(event.target.value)} placeholder="https://..." /></div><Input value={supportImageAlt} onChange={(event) => setSupportImageAlt(event.target.value)} placeholder="Texto alternativo da imagem" /></div></Field></div>
          <div className="space-y-3 border-t pt-4"><div className="flex items-center justify-between"><Label className="flex items-center gap-2"><Video className="size-4 text-muted-foreground" />Vídeos relacionados</Label><Button type="button" variant="outline" size="sm" onClick={() => setVideos((current) => [...current, { title: "", url: "", durationMinutes: "" }])}><Plus className="size-3.5" />Adicionar vídeo</Button></div>{videos.map((video, index) => <div key={`video-${index}`} className="grid gap-2 rounded-xl border p-3 md:grid-cols-[1fr_1fr_120px_auto]"><Input value={video.title} onChange={(event) => setVideos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} placeholder="Título da aula" /><Input value={video.url} onChange={(event) => setVideos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item))} placeholder="URL do vídeo" /><Input value={video.durationMinutes} onChange={(event) => setVideos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, durationMinutes: event.target.value } : item))} placeholder="Minutos" type="number" min="1" /><Button type="button" variant="ghost" size="icon" onClick={() => setVideos((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="size-4" /></Button></div>)}</div>
        </CardContent></Card>
      </section>}

      {(!wizardMode || currentStep === 7) && <section className="space-y-3">
        <SectionHeading number="07" title="Configurações de publicação" description="Defina visibilidade, revisão e interação dos alunos." />
        <Card><CardContent className="divide-y p-4">
          <label className="flex items-center justify-between gap-4 py-3 first:pt-0"><span><span className="block text-sm font-medium">Visibilidade pública</span><span className="text-xs text-muted-foreground">Permitir que a questão apareça para os alunos.</span></span><input type="checkbox" checked={visibility === "public"} onChange={(event) => setVisibility(event.target.checked ? "public" : "private")} /></label>
          <label className="flex items-center justify-between gap-4 py-3"><span><span className="block text-sm font-medium">Permitir comentários</span><span className="text-xs text-muted-foreground">Alunos poderão comentar na questão.</span></span><input type="checkbox" checked={allowComments} onChange={(event) => setAllowComments(event.target.checked)} /></label>
          <label className="flex items-center justify-between gap-4 py-3"><span><span className="block text-sm font-medium">Enviar para revisão</span><span className="text-xs text-muted-foreground">Salvar como pendente de revisão técnica.</span></span><input type="checkbox" checked={reviewMode} onChange={(event) => setReviewMode(event.target.checked)} /></label>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3"><div><p className="text-sm font-medium">Status inicial</p><p className="text-xs text-muted-foreground">Você ainda poderá revisar antes de publicar.</p></div><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="draft">Salvar como rascunho</option><option value="in_review">Enviar para revisão</option><option value="published">Publicar agora</option></select></div>
        </CardContent></Card>
      </section>}

      {(!wizardMode || currentStep === 7) && <Card id="question-preview" className="border-primary/20 bg-primary/[0.03]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span>Pré-visualização</span>
            {selectedType && <Badge variant="outline">{selectedType.title}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {supportText && <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: supportText }} />}
          {supportImageUrl && <img src={supportImageUrl} alt={supportImageAlt || "Imagem de apoio"} className="max-h-64 rounded-xl border object-contain" />}
          {statement ? <div className="prose prose-sm dark:prose-invert max-w-none font-medium" dangerouslySetInnerHTML={{ __html: statement }} /> : <p className="text-sm font-medium">O enunciado aparecerá aqui enquanto você digita.</p>}
          {format !== "free_text" && alternatives.length > 0 && (
            <div className="space-y-2">
              {alternatives.map((alternative) => (
                <div key={alternative.letter} className={`rounded-md border px-3 py-2 text-sm ${alternative.isCorrect ? "border-emerald-500/50 bg-emerald-500/10" : "border-border"}`}>
                  <span className="mr-2 font-semibold">{alternative.letter})</span>
                  {alternative.content || "Alternativa sem texto"}
                </div>
              ))}
            </div>
          )}
          {resolution && <div className="border-t pt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Resolução</p><div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: resolution }} /></div>}
          {objectives.some(Boolean) && <div className="border-t pt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Objetivos</p><ul className="list-disc pl-5 text-sm">{objectives.filter(Boolean).map((objectiveValue, index) => <li key={index}>{objectiveValue}</li>)}</ul></div>}
        </CardContent>
      </Card>}

      {wizardMode && <div className="flex items-center justify-between border-t pt-5">
        <Button type="button" variant="outline" size="sm" disabled={currentStep === 1} onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}><ChevronLeft className="size-3.5" />Voltar</Button>
        {currentStep < 7 ? <Button type="button" size="sm" onClick={() => setCurrentStep((step) => Math.min(7, step + 1))}>Próxima etapa<ChevronRight className="size-3.5" /></Button> : <Button type="submit" size="sm" onClick={() => requestSubmit("published")}>Finalizar e publicar</Button>}
      </div>}
    </form>
  )
}
