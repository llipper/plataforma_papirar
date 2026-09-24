import { notFound } from "next/navigation"

import { MaterialReader } from "@/components/materials"
import { getMaterialBySlug } from "@/lib/materials/constants"

type MaterialReaderPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function MaterialReaderPage({ params }: MaterialReaderPageProps) {
  const { slug } = await params
  const material = getMaterialBySlug(slug)

  if (!material) notFound()

  return <MaterialReader material={material} />
}
