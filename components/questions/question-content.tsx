"use client"

import { useMemo } from "react"
import { sanitizeHtml } from "@/lib/questions/sanitizer"

export interface QuestionContentProps {
  questionText: string
  className?: string
}

export function QuestionContent({ questionText, className = "" }: QuestionContentProps) {
  const safeContent = useMemo(() => sanitizeHtml(questionText), [questionText])

  return (
    <div
      className={`prose dark:prose-invert max-w-none text-lg font-semibold leading-relaxed text-foreground/90 tracking-tight ${className}`}
      dangerouslySetInnerHTML={{ __html: safeContent }}
    />
  )
}
