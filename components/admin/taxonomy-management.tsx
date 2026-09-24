"use client"

import * as React from "react"
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Edit2,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type {
  TaxonomyItem,
  TaxonomyKind,
  TaxonomyLevel,
} from "@/lib/taxonomies/types"
import { firebaseAuth } from "@/lib/firebase/client"

async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = firebaseAuth.currentUser
  if (!user) return {}

  return {
    Authorization: `Bearer ${await user.getIdToken()}`,
  }
}

type TaxonomyConfig = {
  title: string
  subtitle: string
  singular: string
  kind: TaxonomyKind
}

type InlineAdd = {
  parentId: string
  level: TaxonomyLevel
  indent: number
}

type GeographicScopeOption = {
  id: string
  name: string
  abbreviation: string | null
  slug: string
}

type FederativeUnitOption = {
  id: string
  name: string
  code: string
  slug: string
}

type GeographyResponse = {
  geographicScopes?: GeographicScopeOption[]
  federativeUnits?: FederativeUnitOption[]
}

const fieldLabels: Record<
  TaxonomyKind,
  {
    name: string
    code?: string
    showWeight?: boolean
    showColor?: boolean
    showQuestionTypeFields?: boolean
  }
> = {
  subjects: {
    name: "Nome da disciplina",
    code: "Sigla / Código",
  },

  careers: {
    name: "Nome da carreira",
  },

  difficulty: {
    name: "Nome da dificuldade",
    code: "Sigla / Código",
    showWeight: true,
    showColor: true,
  },

  education: {
    name: "Nome do nível",
    code: "Sigla / Código",
  },

  boards: {
    name: "Nome da banca",
    code: "Sigla / Código",
  },

  "question-types": {
    name: "Nome do tipo",
    code: "Sigla / Código",
    showQuestionTypeFields: true,
  },
}

const emptyMessages: Record<
  TaxonomyKind,
  {
    title: string
    description: string
  }
> = {
  subjects: {
    title: "Nenhuma disciplina cadastrada",
    description:
      "Crie a primeira disciplina pelo botão acima. Assuntos, tópicos e subtópicos entram pela própria tabela.",
  },

  careers: {
    title: "Nenhuma carreira cadastrada",
    description:
      "Crie a carreira principal pelo botão acima. Subcarreiras, órgãos, concursos e cargos entram pela própria tabela.",
  },

  difficulty: {
    title: "Nenhum nível de dificuldade cadastrado",
    description:
      "Crie níveis para classificar questões por esforço e complexidade.",
  },

  education: {
    title: "Nenhum nível educacional cadastrado",
    description:
      "Crie níveis educacionais para organizar o público-alvo das questões.",
  },

  boards: {
    title: "Nenhuma banca examinadora cadastrada",
    description:
      "As bancas cadastradas aparecerão aqui para filtrar e classificar questões.",
  },

  "question-types": {
    title: "Nenhum tipo de questão cadastrado",
    description:
      "Crie tipos para separar múltipla escolha, certo ou errado e outros formatos.",
  },
}

const rootLevel: Record<TaxonomyKind, TaxonomyLevel> = {
  subjects: "disciplina",
  careers: "carreira",
  difficulty: "dificuldade",
  education: "nivelEducacional",
  boards: "banca",
  "question-types": "tipoQuestao",
}

const childLevel: Partial<Record<TaxonomyLevel, TaxonomyLevel>> = {
  disciplina: "assunto",
  assunto: "topico",
  topico: "subtopico",

  carreira: "subcarreira",
  subcarreira: "orgao",
  orgao: "concurso",
  concurso: "cargo",
}

const levelLabel: Record<TaxonomyLevel, string> = {
  disciplina: "DISCIPLINA",
  assunto: "ASSUNTO",
  topico: "TÓPICO",
  subtopico: "SUBTÓPICO",

  carreira: "CARREIRA",
  subcarreira: "SUBCARREIRA",
  orgao: "ÓRGÃO",
  concurso: "CONCURSO",
  cargo: "CARGO",

  dificuldade: "DIFICULDADE",
  nivelEducacional: "EDUCACIONAL",
  banca: "BANCA",
  tipoQuestao: "TIPO",
}

const levelBadgeClass: Record<TaxonomyLevel, string> = {
  disciplina: "bg-blue-500/10 text-blue-600",
  assunto: "bg-primary/10 text-primary",
  topico: "bg-amber-500/10 text-amber-600",
  subtopico: "bg-muted text-muted-foreground",

  carreira: "bg-purple-500/10 text-purple-600",
  subcarreira: "bg-cyan-500/10 text-cyan-600",
  orgao: "bg-indigo-500/10 text-indigo-600",
  concurso: "bg-pink-500/10 text-pink-600",
  cargo: "bg-slate-500/10 text-slate-600",

  dificuldade: "bg-orange-500/10 text-orange-600",
  nivelEducacional: "bg-sky-500/10 text-sky-600",
  banca: "bg-emerald-500/10 text-emerald-600",
  tipoQuestao: "bg-teal-500/10 text-teal-600",
}

function getChildren(items: TaxonomyItem[], parentId: string) {
  return items.filter((item) => item.parentId === parentId)
}

function getDescendants(
  items: TaxonomyItem[],
  parentId: string
): TaxonomyItem[] {
  const children = getChildren(items, parentId)

  return children.flatMap((child) => [
    child,
    ...getDescendants(items, child.id),
  ])
}

function buildVisibleTree(
  items: TaxonomyItem[],
  expandedIds: Set<string>,
  search: string
) {
  const query = search.trim().toLowerCase()

  const matchesSearch = (item: TaxonomyItem) => {
    const searchableValues = [
      item.title,
      item.meta,
      item.subtitle,
      item.geographicScopeName,
      item.federativeUnitName,
      item.federativeUnitCode,
      item.examYear?.toString(),
    ]

    return searchableValues.some((value) =>
      value?.toLowerCase().includes(query)
    )
  }

  const visible: TaxonomyItem[] = []

  function visit(parentId: string | null) {
    items
      .filter((item) => item.parentId === parentId)
      .forEach((item) => {
        if (query) {
          const descendants = getDescendants(items, item.id)

          if (
            !matchesSearch(item) &&
            !descendants.some(matchesSearch)
          ) {
            return
          }
        }

        visible.push(item)

        if (query || expandedIds.has(item.id)) {
          visit(item.id)
        }
      })
  }

  visit(null)

  return visible
}

async function readJsonError(response: Response) {
  try {
    const body = await response.json()

    return typeof body.error === "string"
      ? body.error
      : "Falha ao salvar."
  } catch {
    return "Falha ao salvar."
  }
}

function isValidExamYear(value: string) {
  const year = Number.parseInt(value, 10)
  return /^\d{4}$/.test(value) && year >= 1900 && year <= 2200
}

export function TaxonomyManagement({
  config,
}: {
  config: TaxonomyConfig
}) {
  const [items, setItems] = React.useState<TaxonomyItem[]>([])

  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
    new Set()
  )

  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // --------------------------------------------------------------------------
  // Root creation
  // --------------------------------------------------------------------------

  const [draftName, setDraftName] = React.useState("")

  // --------------------------------------------------------------------------
  // Inline creation
  // --------------------------------------------------------------------------

  const [inlineAdd, setInlineAdd] =
    React.useState<InlineAdd | null>(null)

  const [inlineValue, setInlineValue] = React.useState("")

  const [inlineGeographicScopeId, setInlineGeographicScopeId] =
    React.useState("")

  const [inlineFederativeUnitId, setInlineFederativeUnitId] =
    React.useState("")

  const [inlineYear, setInlineYear] = React.useState("")

  // --------------------------------------------------------------------------
  // Edit
  // --------------------------------------------------------------------------

  const [editingItem, setEditingItem] =
    React.useState<TaxonomyItem | null>(null)

  const [editName, setEditName] = React.useState("")

  const [editGeographicScopeId, setEditGeographicScopeId] =
    React.useState("")

  const [editFederativeUnitId, setEditFederativeUnitId] =
    React.useState("")

  const [editYear, setEditYear] = React.useState("")

  // --------------------------------------------------------------------------
  // Geography reference data
  // --------------------------------------------------------------------------

  const [geographicScopes, setGeographicScopes] = React.useState<
    GeographicScopeOption[]
  >([])

  const [federativeUnits, setFederativeUnits] = React.useState<
    FederativeUnitOption[]
  >([])

  const [geographyLoading, setGeographyLoading] =
    React.useState(false)

  // --------------------------------------------------------------------------
  // General state
  // --------------------------------------------------------------------------

  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")

  const [answerFormat, setAnswerFormat] =
    React.useState("multiple_choice")

  const [alternativeCount, setAlternativeCount] =
    React.useState("5")

  const [displayColor, setDisplayColor] =
    React.useState("#FFD700")

  const fields = fieldLabels[config.kind]
  const emptyMessage = emptyMessages[config.kind]

  const visibleItems = React.useMemo(
    () => buildVisibleTree(items, expandedIds, search),
    [expandedIds, items, search]
  )

  const canCreateChildren =
    config.kind === "subjects" ||
    config.kind === "careers"

  // --------------------------------------------------------------------------
  // Load taxonomy
  // --------------------------------------------------------------------------

  const loadItems = React.useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `/api/admin/taxonomies/${config.kind}`,
        {
          cache: "no-store",
          headers: await getAuthHeaders(),
        }
      )

      if (!response.ok) {
        throw new Error(await readJsonError(response))
      }

      const data = await response.json()

      setItems(
        Array.isArray(data.items)
          ? data.items
          : []
      )
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível carregar os cadastros."
      )
    } finally {
      setLoading(false)
    }
  }, [config.kind])

  // --------------------------------------------------------------------------
  // Load geography
  // --------------------------------------------------------------------------

  const loadGeography = React.useCallback(async () => {
    if (config.kind !== "careers") {
      return
    }

    setGeographyLoading(true)

    try {
      const response = await fetch(
        "/api/admin/taxonomies/geography",
        {
          cache: "no-store",
          headers: await getAuthHeaders(),
        }
      )

      if (!response.ok) {
        throw new Error(await readJsonError(response))
      }

      const data: GeographyResponse =
        await response.json()

      setGeographicScopes(
        Array.isArray(data.geographicScopes)
          ? data.geographicScopes
          : []
      )

      setFederativeUnits(
        Array.isArray(data.federativeUnits)
          ? data.federativeUnits
          : []
      )
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível carregar os dados geográficos."
      )
    } finally {
      setGeographyLoading(false)
    }
  }, [config.kind])

  React.useEffect(() => {
    void loadItems()
  }, [loadItems])

  React.useEffect(() => {
    void loadGeography()
  }, [loadGeography])

  // --------------------------------------------------------------------------
  // Geography helpers
  // --------------------------------------------------------------------------

  function getScopeById(id: string) {
    return geographicScopes.find(
      (scope) => scope.id === id
    )
  }

  function scopeRequiresFederativeUnit(scopeId: string) {
    const scope = getScopeById(scopeId)

    if (!scope) {
      return false
    }

    return scope.slug !== "nacional"
  }

  function handleInlineScopeChange(value: string) {
    setInlineGeographicScopeId(value)

    if (!scopeRequiresFederativeUnit(value)) {
      setInlineFederativeUnitId("")
    }
  }

  function handleEditScopeChange(value: string) {
    setEditGeographicScopeId(value)

    if (!scopeRequiresFederativeUnit(value)) {
      setEditFederativeUnitId("")
    }
  }

  // --------------------------------------------------------------------------
  // Root modal
  // --------------------------------------------------------------------------

  function closeModal() {
    setDraftName("")
    setAnswerFormat("multiple_choice")
    setAlternativeCount("5")
    setDisplayColor("#FFD700")
    setIsCreateOpen(false)
  }

  // --------------------------------------------------------------------------
  // Edit modal
  // --------------------------------------------------------------------------

  function openEdit(item: TaxonomyItem) {
    setEditingItem(item)
    setEditName(item.title)

    setEditGeographicScopeId(
      item.geographicScopeId ?? ""
    )

    setEditFederativeUnitId(
      item.federativeUnitId ?? ""
    )

    setEditYear(
      item.level === "concurso" && item.examYear
        ? String(item.examYear)
        : ""
    )
  }

  function closeEdit() {
    setEditingItem(null)
    setEditName("")
    setEditGeographicScopeId("")
    setEditFederativeUnitId("")
    setEditYear("")
  }

  async function handleEdit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const hasRequiredValue = editingItem?.level === "concurso"
      ? isValidExamYear(editYear)
      : Boolean(editName.trim())

    if (!editingItem || !hasRequiredValue || saving) {
      return
    }

    if (
      editingItem.level === "orgao" &&
      !editGeographicScopeId
    ) {
      setError(
        "Selecione a abrangência geográfica do órgão."
      )

      return
    }

    if (
      editingItem.level === "orgao" &&
      scopeRequiresFederativeUnit(
        editGeographicScopeId
      ) &&
      !editFederativeUnitId
    ) {
      setError(
        "Selecione a unidade federativa do órgão."
      )

      return
    }

    const success = await requestAndReload(
      "PATCH",
      {
        id: editingItem.id,
        level: editingItem.level,
        name:
          editingItem.level === "concurso"
            ? undefined
            : editName.trim(),

        examYear:
          editingItem.level === "concurso"
            ? editYear
              ? Number.parseInt(editYear, 10)
              : null
            : undefined,

        geographicScopeId:
          editingItem.level === "orgao"
            ? editGeographicScopeId
            : undefined,

        federativeUnitId:
          editingItem.level === "orgao"
            ? editFederativeUnitId || null
            : undefined,
      }
    )

    if (success) {
      closeEdit()
    }
  }

  // --------------------------------------------------------------------------
  // Create root
  // --------------------------------------------------------------------------

  async function handleCreateRoot(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!draftName.trim() || saving) {
      return
    }

    const formData =
      new FormData(event.currentTarget)

    const format =
      fields.showQuestionTypeFields
        ? answerFormat
        : undefined

    const alternatives =
      format === "free_text"
        ? null
        : format === "true_false"
          ? 2
          : Number.parseInt(
              alternativeCount,
              10
            )

    const success = await requestAndReload(
      "POST",
      {
        level: rootLevel[config.kind],

        name: draftName.trim(),

        code: String(
          formData.get("code") ?? ""
        ).trim(),

        weight: fields.showWeight
          ? Number.parseInt(
              String(
                formData.get("weight") ??
                  "1"
              ),
              10
            )
          : undefined,

        displayColor:
          fields.showColor
            ? displayColor
            : undefined,

        answerFormat: format,

        alternativeCount:
          alternatives,
      }
    )

    if (success) {
      closeModal()
    }
  }

  // --------------------------------------------------------------------------
  // Inline add
  // --------------------------------------------------------------------------

  function openInlineAdd(item: TaxonomyItem) {
    const nextLevel =
      childLevel[item.level]

    if (!nextLevel) {
      return
    }

    setExpandedIds(
      (current) =>
        new Set([
          ...current,
          item.id,
        ])
    )

    setInlineAdd({
      parentId: item.id,
      level: nextLevel,
      indent: item.indent + 1,
    })

    setInlineValue("")
    setInlineGeographicScopeId("")
    setInlineFederativeUnitId("")
    setInlineYear(
      nextLevel === "concurso"
        ? String(new Date().getFullYear())
        : ""
    )
    setError("")
  }

  function closeInlineAdd() {
    setInlineAdd(null)
    setInlineValue("")
    setInlineGeographicScopeId("")
    setInlineFederativeUnitId("")
    setInlineYear("")
  }

  async function saveInlineAdd() {
    const isExam = inlineAdd?.level === "concurso"
    const hasRequiredValue = isExam
      ? isValidExamYear(inlineYear)
      : Boolean(inlineValue.trim())

    if (!inlineAdd || !hasRequiredValue || saving) {
      return
    }

    if (
      inlineAdd.level === "orgao" &&
      !inlineGeographicScopeId
    ) {
      setError(
        "Selecione a abrangência geográfica do órgão."
      )

      return
    }

    if (
      inlineAdd.level === "orgao" &&
      scopeRequiresFederativeUnit(
        inlineGeographicScopeId
      ) &&
      !inlineFederativeUnitId
    ) {
      setError(
        "Selecione a unidade federativa do órgão."
      )

      return
    }

    const success = await requestAndReload(
      "POST",
      {
        level: inlineAdd.level,
        parentId: inlineAdd.parentId,
        name: isExam ? undefined : inlineValue.trim(),

        examYear:
          inlineAdd.level === "concurso"
            ? inlineYear
              ? Number.parseInt(
                  inlineYear,
                  10
                )
              : null
            : undefined,

        geographicScopeId:
          inlineAdd.level === "orgao"
            ? inlineGeographicScopeId
            : undefined,

        federativeUnitId:
          inlineAdd.level === "orgao"
            ? inlineFederativeUnitId ||
              null
            : undefined,
      }
    )

    if (success) {
      closeInlineAdd()
    }
  }

  // --------------------------------------------------------------------------
  // API request
  // --------------------------------------------------------------------------

  async function requestAndReload(
    method:
      | "POST"
      | "PATCH"
      | "DELETE",
    body: Record<string, unknown>
  ) {
    setSaving(true)
    setError("")

    try {
      const response = await fetch(
        `/api/admin/taxonomies/${config.kind}`,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
            ...(await getAuthHeaders()),
          },
          body: JSON.stringify(body),
        }
      )

      if (!response.ok) {
        throw new Error(
          await readJsonError(response)
        )
      }

      await loadItems()

      return true
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível salvar."
      )

      return false
    } finally {
      setSaving(false)
    }
  }

  function toggleExpand(id: string) {
    setExpandedIds((current) => {
      const next = new Set(current)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  return (
    <section className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            {config.subtitle}
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {config.title}
          </h1>
        </div>

        <Button
          className="h-10 gap-2"
          disabled={saving}
          onClick={() =>
            setIsCreateOpen(true)
          }
        >
          <Plus className="size-4" />
          Novo {config.singular}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Buscar por nome ou sigla..."
              className="h-10 bg-background pl-9"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {loading && (
              <Loader2 className="size-3.5 animate-spin" />
            )}

            <span>
              {items.length} itens
            </span>

            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

            <span>
              {
                items.filter(
                  (item) =>
                    item.active
                ).length
              }{" "}
              ativos
            </span>
          </div>
        </div>

        <div
          aria-label={
            search
              ? `Resultados para ${search}`
              : `Lista de ${config.title}`
          }
        >
          {visibleItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="px-4 text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                    Nome
                  </TableHead>

                  <TableHead className="w-[160px] text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                    Nível / Sigla
                  </TableHead>

                  <TableHead className="w-[110px] text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                    Questões
                  </TableHead>

                  <TableHead className="w-[120px] text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>

                  <TableHead className="w-[130px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {visibleItems.map(
                  (item) => {
                    const children =
                      getChildren(
                        items,
                        item.id
                      )

                    const hasChildren =
                      children.length > 0

                    const nextLevel =
                      childLevel[
                        item.level
                      ]

                    const isExpanded =
                      Boolean(
                        search.trim()
                      ) ||
                      expandedIds.has(
                        item.id
                      )

                    return (
                      <React.Fragment
                        key={item.id}
                      >
                        <TableRow className="group hover:bg-muted/30">
                          <TableCell
                            className="px-4 py-3"
                            style={{
                              paddingLeft: `calc(1rem + ${
                                item.indent *
                                2.25
                              }rem)`,
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex size-5 shrink-0 items-center justify-center">
                                {hasChildren ? (
                                  <button
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                    onClick={() =>
                                      toggleExpand(
                                        item.id
                                      )
                                    }
                                    type="button"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="size-4" />
                                    ) : (
                                      <ChevronRight className="size-4" />
                                    )}
                                  </button>
                                ) : (
                                  <span className="size-4" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex min-w-0 items-center gap-2">
                                  {item.displayColor && (
                                    <span
                                      className="size-2.5 shrink-0 rounded-full"
                                      style={{
                                        backgroundColor:
                                          item.displayColor,
                                      }}
                                      title={
                                        item.displayColor
                                      }
                                    />
                                  )}

                                  <p
                                    className={
                                      item.indent ===
                                      0
                                        ? "truncate text-sm font-semibold"
                                        : "truncate text-sm font-medium"
                                    }
                                  >
                                    {
                                      item.title
                                    }
                                  </p>
                                </div>

                                {item.subtitle && (
                                  <p className="truncate text-[0.7rem] text-muted-foreground">
                                    {
                                      item.subtitle
                                    }
                                  </p>
                                )}

                                {item.level ===
                                  "orgao" &&
                                  (item.geographicScopeName ||
                                    item.federativeUnitName ||
                                    item.federativeUnitCode) && (
                                    <p className="truncate text-[0.7rem] text-muted-foreground">
                                      {[
                                        item.federativeUnitName,
                                        item.federativeUnitCode,
                                        item.geographicScopeName,
                                      ]
                                        .filter(
                                          Boolean
                                        )
                                        .join(
                                          " · "
                                        )}
                                    </p>
                                  )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                levelBadgeClass[
                                  item.level
                                ]
                              }
                            >
                              {item.meta}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-2 px-2 text-xs"
                            >
                              <BookOpen className="size-3.5" />
                              {
                                item.questionsCount
                              }
                            </Button>
                          </TableCell>

                          <TableCell>
                            <button
                              type="button"
                              disabled={
                                saving
                              }
                              onClick={() =>
                                requestAndReload(
                                  "PATCH",
                                  {
                                    id: item.id,
                                    level:
                                      item.level,
                                    isActive:
                                      !item.active,
                                  }
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[0.65rem] font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
                            >
                              <span
                                className={
                                  item.active
                                    ? "size-1.5 rounded-full bg-emerald-500"
                                    : "size-1.5 rounded-full bg-muted-foreground/40"
                                }
                              />

                              {item.active
                                ? "Ativo"
                                : "Inativo"}
                            </button>
                          </TableCell>

                          <TableCell className="pr-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {canCreateChildren &&
                                nextLevel && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    title={`Adicionar ${levelLabel[
                                      nextLevel
                                    ].toLowerCase()}`}
                                    disabled={
                                      saving
                                    }
                                    onClick={() =>
                                      openInlineAdd(
                                        item
                                      )
                                    }
                                  >
                                    <Plus className="size-3.5" />
                                  </Button>
                                )}

                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                title="Editar"
                                disabled={
                                  saving
                                }
                                onClick={() =>
                                  openEdit(
                                    item
                                  )
                                }
                              >
                                <Edit2 className="size-3.5" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 hover:text-destructive"
                                title="Excluir"
                                disabled={
                                  saving
                                }
                                onClick={() =>
                                  requestAndReload(
                                    "DELETE",
                                    {
                                      id: item.id,
                                      level:
                                        item.level,
                                    }
                                  )
                                }
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>

                        {inlineAdd?.parentId ===
                          item.id && (
                          <TableRow className="bg-primary/5 hover:bg-primary/5">
                            <TableCell
                              className="px-4 py-2"
                              style={{
                                paddingLeft: `calc(1rem + ${
                                  inlineAdd.indent *
                                  2.25
                                }rem)`,
                              }}
                            >
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                  <Plus className="size-3.5 shrink-0 text-primary" />

                                  {inlineAdd.level === "concurso" ? (
                                    <div className="flex h-8 items-center px-3 text-xs text-muted-foreground">
                                      Novo concurso — informe somente o ano
                                    </div>
                                  ) : (
                                    <Input
                                      autoFocus
                                      value={inlineValue}
                                      onChange={(event) => setInlineValue(event.target.value)}
                                      onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                          event.preventDefault()
                                          void saveInlineAdd()
                                        }

                                        if (event.key === "Escape") {
                                          closeInlineAdd()
                                        }
                                      }}
                                      placeholder={`Novo ${levelLabel[inlineAdd.level].toLowerCase()}...`}
                                      className="h-8 border-0 bg-background/60 px-3 shadow-none focus-visible:ring-1"
                                    />
                                  )}
                                </div>

                                {inlineAdd.level ===
                                  "orgao" && (
                                  <div className="grid gap-2 pl-6 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                      <Label className="text-xs">
                                        Abrangência
                                      </Label>

                                      <Select
                                        value={
                                          inlineGeographicScopeId
                                        }
                                        onValueChange={(value) =>
                                          handleInlineScopeChange(value ?? "")
                                        }
                                        disabled={
                                          geographyLoading
                                        }
                                      >
                                        <SelectTrigger className="h-8 w-full bg-background/60 text-xs">
                                          <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>

                                        <SelectContent>
                                          {geographicScopes.map(
                                            (
                                              scope
                                            ) => (
                                              <SelectItem
                                                key={
                                                  scope.id
                                                }
                                                value={
                                                  scope.id
                                                }
                                              >
                                                {
                                                  scope.name
                                                }
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                      <Label className="text-xs">
                                        Unidade
                                        Federativa
                                      </Label>

                                      <Select
                                        value={
                                          inlineFederativeUnitId
                                        }
                                        onValueChange={
                                          (value) =>
                                            setInlineFederativeUnitId(value ?? "")
                                        }
                                        disabled={
                                          geographyLoading ||
                                          !inlineGeographicScopeId ||
                                          !scopeRequiresFederativeUnit(
                                            inlineGeographicScopeId
                                          )
                                        }
                                      >
                                        <SelectTrigger className="h-8 w-full bg-background/60 text-xs">
                                          <SelectValue
                                            placeholder={
                                              inlineGeographicScopeId &&
                                              !scopeRequiresFederativeUnit(
                                                inlineGeographicScopeId
                                              )
                                                ? "Não se aplica"
                                                : "Selecione"
                                            }
                                          />
                                        </SelectTrigger>

                                        <SelectContent>
                                          {federativeUnits.map(
                                            (
                                              unit
                                            ) => (
                                              <SelectItem
                                                key={
                                                  unit.id
                                                }
                                                value={
                                                  unit.id
                                                }
                                              >
                                                {
                                                  unit.name
                                                }{" "}
                                                (
                                                {
                                                  unit.code
                                                }
                                                )
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}

                                {inlineAdd.level ===
                                  "concurso" && (
                                  <div className="pl-6 sm:max-w-32">
                                    <Label className="mb-1.5 block text-xs">
                                      Ano
                                    </Label>

                                    <Input
                                      autoFocus={inlineAdd.level === "concurso"}
                                      value={
                                        inlineYear
                                      }
                                      onChange={(
                                        event
                                      ) =>
                                        setInlineYear(
                                          event.target.value
                                            .replace(
                                              /\D/g,
                                              ""
                                            )
                                            .slice(
                                              0,
                                              4
                                            )
                                        )
                                      }
                                      placeholder="2025"
                                      inputMode="numeric"
                                      maxLength={
                                        4
                                      }
                                      className="h-8 border-0 bg-background/60 px-3 text-xs shadow-none focus-visible:ring-1"
                                    />
                                  </div>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={
                                  levelBadgeClass[
                                    inlineAdd
                                      .level
                                  ]
                                }
                              >
                                {
                                  levelLabel[
                                    inlineAdd
                                      .level
                                  ]
                                }
                              </Badge>
                            </TableCell>

                            <TableCell
                              colSpan={3}
                            >
                              <div className="flex items-center justify-end gap-1 pr-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-8"
                                  onClick={() =>
                                    void saveInlineAdd()
                                  }
                                  disabled={
                                    (inlineAdd.level === "concurso"
                                      ? !isValidExamYear(inlineYear)
                                      : !inlineValue.trim()) || saving
                                  }
                                >
                                  <Check className="size-3.5 text-primary" />
                                </Button>

                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-8"
                                  onClick={
                                    closeInlineAdd
                                  }
                                  disabled={
                                    saving
                                  }
                                >
                                  <X className="size-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    )
                  }
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="flex min-h-72 items-center justify-center px-6 py-10">
              <div className="flex max-w-sm flex-col items-center text-center">
                <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  {loading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <ClipboardList className="size-5" />
                  )}
                </div>

                <h2 className="text-sm font-semibold text-foreground">
                  {loading
                    ? "Carregando cadastros"
                    : search
                      ? "Nenhum resultado encontrado"
                      : emptyMessage.title}
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {loading
                    ? "Buscando os dados no PostgreSQL."
                    : search
                      ? "Tente buscar por outro nome, sigla ou identificador."
                      : emptyMessage.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* CREATE ROOT                                                     */}
      {/* ================================================================ */}

      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeModal()
          } else {
            setIsCreateOpen(true)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Novo {config.singular}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={handleCreateRoot}
          >
            <div className="space-y-2">
              <Label
                htmlFor={`${config.kind}-name`}
              >
                {fields.name}
              </Label>

              <Input
                id={`${config.kind}-name`}
                value={draftName}
                onChange={(event) =>
                  setDraftName(
                    event.target.value
                  )
                }
                placeholder={`Ex.: ${config.singular}`}
                required
              />
            </div>

            {fields.code && (
              <div className="space-y-2">
                <Label
                  htmlFor={`${config.kind}-code`}
                >
                  {fields.code}
                </Label>

                <Input
                  id={`${config.kind}-code`}
                  name="code"
                  placeholder="Opcional"
                />
              </div>
            )}

            {fields.showQuestionTypeFields && (
              <div className="space-y-4 rounded-lg border border-border/70 p-3">
                <div className="space-y-2">
                  <Label>
                    Formato / Comportamento
                  </Label>

                  <Select
                    value={answerFormat}
                    onValueChange={(value) =>
                        setAnswerFormat(value ?? "")
                    }
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue>
                        {answerFormat === "multiple_choice"
                          ? "Alternativas (Múltipla escolha)"
                          : answerFormat === "true_false"
                            ? "Certo ou errado"
                            : "Texto (Discursiva)"}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="multiple_choice">
                        Alternativas
                        (Múltipla escolha)
                      </SelectItem>

                      <SelectItem value="true_false">
                        Certo ou errado
                      </SelectItem>

                      <SelectItem value="free_text">
                        Texto (Discursiva)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {answerFormat ===
                  "multiple_choice" && (
                  <div className="space-y-2">
                    <Label>
                      Quantidade de
                      alternativas
                    </Label>

                    <Select
                      value={
                        alternativeCount
                      }
                      onValueChange={(
                        value
                      ) =>
                        setAlternativeCount(value ?? "")
                      }
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue>
                          {alternativeCount === "4"
                            ? "4 alternativas"
                            : "5 alternativas"}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="4">
                          4 alternativas
                        </SelectItem>

                        <SelectItem value="5">
                          5 alternativas
                        </SelectItem>

                      </SelectContent>
                    </Select>
                  </div>
                )}

                {answerFormat ===
                  "true_false" && (
                  <p className="rounded-md border border-primary/10 bg-primary/5 p-3 text-xs text-muted-foreground">
                    Certo ou errado usa
                    automaticamente 2
                    alternativas.
                  </p>
                )}

                {answerFormat ===
                  "free_text" && (
                  <p className="rounded-md border border-primary/10 bg-primary/5 p-3 text-xs text-muted-foreground">
                    Texto discursivo não usa
                    alternativas.
                  </p>
                )}
              </div>
            )}

            {fields.showWeight && (
              <div className="space-y-2">
                <Label
                  htmlFor={`${config.kind}-weight`}
                >
                  Peso
                </Label>

                <Input
                  id={`${config.kind}-weight`}
                  name="weight"
                  type="number"
                  defaultValue="1"
                  min="1"
                  max="100"
                />
              </div>
            )}

            {fields.showColor && (
              <div className="space-y-2">
                <Label
                  htmlFor={`${config.kind}-color`}
                >
                  Cor
                </Label>

                <div className="flex items-center gap-2">
                  <Input
                    id={`${config.kind}-color`}
                    type="color"
                    value={
                      displayColor
                    }
                    onChange={(event) =>
                      setDisplayColor(
                        event.target.value
                      )
                    }
                    className="h-10 w-14 p-1"
                  />

                  <Input
                    value={
                      displayColor
                    }
                    onChange={(event) =>
                      setDisplayColor(
                        event.target.value
                      )
                    }
                    placeholder="#FFD700"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={saving}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Salvando..."
                  : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================================================================ */}
      {/* EDIT                                                            */}
      {/* ================================================================ */}

      <Dialog
        open={Boolean(editingItem)}
        onOpenChange={(open) => {
          if (!open) {
            closeEdit()
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Editar{" "}
              {editingItem
                ? levelLabel[
                    editingItem.level
                  ].toLowerCase()
                : "item"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={handleEdit}
          >
            {editingItem?.level === "concurso" ? (
              <div className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                A identificação será gerada automaticamente como{" "}
                <strong className="text-foreground">
                  Concurso {editYear || "{ano}"}
                </strong>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor={`${config.kind}-edit-name`}>Nome</Label>

                <Input
                  id={`${config.kind}-edit-name`}
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  required
                />
              </div>
            )}

            {editingItem?.level ===
              "orgao" && (
              <div className="grid gap-4 rounded-lg border border-border/70 p-3">
                <div className="space-y-2">
                  <Label>
                    Abrangência
                  </Label>

                  <Select
                    value={
                      editGeographicScopeId
                    }
                    onValueChange={
                      (value) => handleEditScopeChange(value ?? "")
                    }
                    disabled={
                      geographyLoading
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a abrangência" />
                    </SelectTrigger>

                    <SelectContent>
                      {geographicScopes.map(
                        (scope) => (
                          <SelectItem
                            key={scope.id}
                            value={
                              scope.id
                            }
                          >
                            {
                              scope.name
                            }
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Unidade Federativa
                  </Label>

                  <Select
                    value={
                      editFederativeUnitId
                    }
                    onValueChange={
                      (value) => setEditFederativeUnitId(value ?? "")
                    }
                    disabled={
                      geographyLoading ||
                      !editGeographicScopeId ||
                      !scopeRequiresFederativeUnit(
                        editGeographicScopeId
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          editGeographicScopeId &&
                          !scopeRequiresFederativeUnit(
                            editGeographicScopeId
                          )
                            ? "Não se aplica"
                            : "Selecione a unidade federativa"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {federativeUnits.map(
                        (unit) => (
                          <SelectItem
                            key={unit.id}
                            value={
                              unit.id
                            }
                          >
                            {unit.name} (
                            {unit.code})
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {editingItem?.level ===
              "concurso" && (
              <div className="space-y-2">
                <Label
                  htmlFor={`${config.kind}-edit-year`}
                >
                  Ano
                </Label>

                <Input
                  id={`${config.kind}-edit-year`}
                  value={editYear}
                  onChange={(event) =>
                    setEditYear(
                      event.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(0, 4)
                    )
                  }
                  placeholder="Ex.: 2025"
                  inputMode="numeric"
                  maxLength={4}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeEdit}
                disabled={saving}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={
                  saving ||
                  !editName.trim()
                }
              >
                {saving
                  ? "Salvando..."
                  : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
