import { AdminDestinationPage } from "@/components/admin/admin-destination-page"

export default async function SupportPage({
  params,
}: {
  params: Promise<{ view?: string[] }>
}) {
  const { view } = await params
  return <AdminDestinationPage kind="support" view={view} />
}
