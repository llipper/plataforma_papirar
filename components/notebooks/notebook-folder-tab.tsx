import React from "react"

interface NotebookFolderTabProps {
  className?: string
}

/**
 * Recorte vetorial da aba de pasta física (folder flap).
 * Preenchido com a cor de fundo do card inferior (currentColor).
 */
export function NotebookFolderTab({ className }: NotebookFolderTabProps) {
  return (
    <svg
      viewBox="0 0 360 32"
      fill="currentColor"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M 0 32 L 0 0 L 128 0 C 148 0 156 16 178 16 L 360 16 L 360 32 Z" />
    </svg>
  )
}
