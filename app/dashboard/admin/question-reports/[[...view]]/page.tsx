import { AdminDestinationPage } from "@/components/admin/admin-destination-page"

export default async function AdminQuestionReportsPage({
  params,
}: {
  params: Promise<{ view?: string[] }>
}) {
  const { view } = await params
  return <AdminDestinationPage kind="reports" view={view} />
}
