"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { INITIAL_NOTEBOOKS } from "@/lib/notebooks/constants"
import type { NotebookItem } from "@/lib/notebooks/types"
import { NotebookGrid } from "@/components/notebooks"

export default function NotebooksPage() {
  const router = useRouter()
  const [notebooks, setNotebooks] = useState<NotebookItem[]>(INITIAL_NOTEBOOKS)

  function handleDeleteNotebook(id: string) {
    setNotebooks((prev) => prev.filter((item) => item.id !== id))
  }

  function handleSelectNotebook(notebook: NotebookItem) {
    router.push(`/dashboard/notebooks/${notebook.id}`)
  }

  return (
    <div className="p-6 w-full">
      {/* Grid com os Cards de Pasta */}
      <NotebookGrid
        notebooks={notebooks}
        onSelectNotebook={handleSelectNotebook}
        onDeleteNotebook={handleDeleteNotebook}
      />
    </div>
  )
}
