import { notFound } from "next/navigation"

import { MaterialGrid } from "@/components/materials"
import { INITIAL_MATERIALS } from "@/lib/materials/constants"
import { INITIAL_NOTEBOOKS } from "@/lib/notebooks/constants"

type NotebookPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function NotebookPage({ params }: NotebookPageProps) {
  const { id } = await params
  const notebook = INITIAL_NOTEBOOKS.find((item) => item.id === id)

  if (!notebook) notFound()

  const materials = INITIAL_MATERIALS.filter(
    (material) => material.discipline === notebook.title,
  )

  return (
    <div className="w-full p-4 sm:p-6">
      <MaterialGrid
        materials={materials}
        headingLabel="Caderno de estudos"
        headingTitle={notebook.title}
        backHref="/dashboard/notebooks"
        searchPlacement="heading"
      />
    </div>
  )
}
