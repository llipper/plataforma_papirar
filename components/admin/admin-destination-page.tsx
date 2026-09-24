import Link from "next/link"

import { ArrowLeft, ArrowRight, FileQuestion, Inbox, LifeBuoy } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "cn"

type DestinationKind = "questions" | "reports" | "support"

type DestinationPageProps = {
  kind: DestinationKind
  view?: string[]
}

const questionViews: Record<string, { title: string; description: string }> = {
  list: {
    title: "Lista de Questões",
    description: "Consulte, filtre e gerencie as questões cadastradas na plataforma.",
  },
  create: {
    title: "Criar Questão",
    description: "Cadastre uma nova questão com classificação, alternativas e resolução.",
  },
  drafts: {
    title: "Rascunhos",
    description: "Continue o trabalho nas questões que ainda não foram publicadas.",
  },
  review: {
    title: "Revisão",
    description: "Revise questões pendentes antes de disponibilizá-las aos estudantes.",
  },
  published: {
    title: "Publicadas",
    description: "Visualize as questões que já estão disponíveis para estudo.",
  },
  rejected: {
    title: "Rejeitadas",
    description: "Consulte questões rejeitadas e os motivos registrados na revisão.",
  },
  import: {
    title: "Importar Questões",
    description: "Importe questões em lote e acompanhe a validação dos dados.",
  },
}

const reportViews: Record<string, { title: string; description: string }> = {
  list: {
    title: "Lista de Reports",
    description: "Acompanhe os reports enviados pelos usuários sobre as questões.",
  },
  review: {
    title: "Revisar Reports",
    description: "Analise os reports pendentes e registre uma decisão de revisão.",
  },
  resolve: {
    title: "Resolver Reports",
    description: "Finalize os reports analisados e mantenha o histórico de decisões.",
  },
}

const supportViews: Record<string, { title: string; description: string }> = {
  new: {
    title: "Abrir Ticket",
    description: "Envie uma solicitação para a equipe de suporte.",
  },
  tickets: {
    title: "Meus Tickets",
    description: "Acompanhe as solicitações abertas pela sua conta.",
  },
  faq: {
    title: "FAQ",
    description: "Encontre respostas para as dúvidas mais comuns sobre a plataforma.",
  },
}

function resolveDestination(kind: DestinationKind, view: string) {
  if (kind === "questions") return questionViews[view] ?? questionViews.list
  if (kind === "reports") return reportViews[view] ?? reportViews.list
  return supportViews[view] ?? supportViews.faq
}

function EmptyState({ kind, view }: DestinationPageProps) {
  const isCreate = kind === "questions" && view?.[0] === "create"
  const isSupport = kind === "support"

  return (
    <Card className="border-border/70 bg-card/60">
      <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center">
        {isSupport ? (
          <LifeBuoy className="size-8 text-muted-foreground" aria-hidden="true" />
        ) : isCreate ? (
          <FileQuestion className="size-8 text-muted-foreground" aria-hidden="true" />
        ) : (
          <Inbox className="size-8 text-muted-foreground" aria-hidden="true" />
        )}
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">
            {isCreate ? "Editor de questões" : isSupport ? "Central de suporte" : "Nenhum registro encontrado"}
          </h2>
          <p className="max-w-md text-xs text-muted-foreground">
            {isCreate
              ? "A estrutura desta tela está pronta para receber o editor conectado ao backend de questões."
              : isSupport
                ? "O fluxo de tickets será conectado ao backend de atendimento nesta área."
                : "Ainda não existem registros disponíveis para esta visão."}
          </p>
        </div>
        {isCreate && (
          <Badge variant="outline">Preparação do editor</Badge>
        )}
      </CardContent>
    </Card>
  )
}

export function AdminDestinationPage({ kind, view = [] }: DestinationPageProps) {
  const currentView = view[0] ?? (kind === "support" ? "faq" : "list")
  const destination = resolveDestination(kind, currentView)
  const basePath = kind === "questions"
    ? "/dashboard/admin/questions"
    : kind === "reports"
      ? "/dashboard/admin/question-reports"
      : "/dashboard/support"

  return (
    <main className="flex w-full flex-1 flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Link
            href={basePath}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" aria-hidden="true" />
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{destination.title}</h1>
            <Badge variant="outline">Administração</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{destination.description}</p>
        </div>
      </div>

      <EmptyState kind={kind} view={view} />

      <div className="flex flex-wrap gap-2">
        {kind === "questions" && currentView !== "create" && (
          <Link href={`${basePath}/create`} className={cn(buttonVariants({ size: "sm" }))}>
            Criar questão
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        )}
        {kind === "support" && currentView !== "new" && (
          <Link href={`${basePath}/new`} className={cn(buttonVariants({ size: "sm" }))}>
            Abrir ticket
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        )}
        {kind === "reports" && currentView !== "review" && (
          <Link href={`${basePath}/review`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Revisar reports
          </Link>
        )}
        <Link href={basePath} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Visão geral
        </Link>
      </div>
    </main>
  )
}
