import { AdminDestinationPage } from "@/components/admin/admin-destination-page"
import { CreateQuestionForm } from "@/components/admin/questions/create-question-form"
import { AdminQuestionList, PublishAllQuestionsButton } from "@/components/admin/questions/admin-question-list"
import Link from "next/link"

export default async function AdminQuestionsPage({
  params,
}: {
  params: Promise<{ view?: string[] }>
}) {
  const { view } = await params
  if (view?.[0] === "create") return <CreateQuestionForm />
  if (view?.[0] === "edit" && view[1]) return <CreateQuestionForm questionId={view[1]} />
  if (["published", "drafts", "review", "list"].includes(view?.[0] ?? "list")) {
    const status = view?.[0] === "published" ? "published" : view?.[0] === "drafts" ? "draft" : view?.[0] === "review" ? "in_review" : undefined
    const title = view?.[0] === "published" ? "Publicadas" : view?.[0] === "drafts" ? "Rascunhos" : view?.[0] === "review" ? "Revisão" : "Lista de Questões"
    return (
      <main className="flex w-full flex-1 flex-col gap-6 p-6">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs text-muted-foreground">Administração</p><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted-foreground">Consulte e gerencie as questões cadastradas na plataforma.</p></div><div className="flex items-center gap-2"><PublishAllQuestionsButton /><ButtonLink /></div></div>
        <AdminQuestionList status={status} />
      </main>
    )
  }
  return <AdminDestinationPage kind="questions" view={view} />
}

function ButtonLink() {
  return <Link href="/dashboard/admin/questions/create" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">Criar questão</Link>
}
