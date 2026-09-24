"use client"

import { useMemo } from "react"
import { sanitizeHtml } from "@/lib/questions/sanitizer"
import type { QuestionAlternative, QuestionAuthor } from "@/lib/questions/types"

export interface QuestionExplanationProps {
  resolution?: string | null
  objectives?: string[]
  tip?: string | null
  references?: string[]
  alternatives?: QuestionAlternative[]
  author?: QuestionAuthor
  show: boolean
}

function getInitials(name?: string): string {
  if (!name) return "P"
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function QuestionExplanation({
  resolution,
  objectives,
  tip,
  references,
  alternatives,
  author,
  show,
}: QuestionExplanationProps) {
  const safeResolution = useMemo(() => sanitizeHtml(resolution), [resolution])

  // Detecta questões Certo/Errado
  const isCertoErrado = useMemo(() => {
    return (
      alternatives?.length === 2 &&
      alternatives.some((a) => a.letter === "C") &&
      alternatives.some((a) => a.letter === "E")
    )
  }, [alternatives])

  // A resolução geral apresenta o raciocínio do gabarito. Para não repetir
  // esse conteúdo na tela do aluno, exibimos aqui apenas os distratores.
  // A explicação da correta continua salva para revisão administrativa.
  const commentedAlternatives = useMemo(() => {
    return alternatives?.filter((alt) => !alt.isCorrect && alt.explanation?.trim()) ?? []
  }, [alternatives])

  if (!show) return null

  const hasContent =
    safeResolution ||
    commentedAlternatives.length > 0 ||
    (objectives && objectives.length > 0) ||
    tip ||
    (references && references.length > 0)

  return (
    <div className="mt-6 border-t border-border/40 pt-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* Coluna Esquerda: Avatar e Nome do Professor */}
        <div className="w-full md:w-36 shrink-0 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-border shadow-sm bg-muted">
            {author?.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt={author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl font-bold">
                {getInitials(author?.name)}
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground text-center uppercase leading-tight px-2">
            PROFESSOR {(author?.name ?? "Papirar").toUpperCase()}
          </span>
        </div>

        {/* Coluna Direita: Conteúdo do Gabarito */}
        <div className="flex-1 space-y-6">

          {!hasContent && (
            <div className="p-8 text-center text-sm text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
              Nenhum gabarito comentado disponível para esta questão.
            </div>
          )}

          {/* 1. Resolução geral */}
          {safeResolution && (
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-foreground">Resolução</h5>
              {/*
                .calc-box é uma classe utilitária inline: no HTML da resolução,
                envolva equações em <span class="calc-box">...</span> para
                renderizá-las num box monospace destacado.
              */}
              <div
                className={[
                  "text-sm text-foreground/80 leading-relaxed font-medium",
                  "prose dark:prose-invert max-w-none",
                  "[&_.calc-box]:block [&_.calc-box]:my-2",
                  "[&_.calc-box]:px-4 [&_.calc-box]:py-2.5",
                  "[&_.calc-box]:rounded-lg [&_.calc-box]:border [&_.calc-box]:border-border/50",
                  "[&_.calc-box]:bg-muted/50 [&_.calc-box]:font-mono [&_.calc-box]:text-[13px]",
                  "[&_.calc-box]:text-foreground [&_.calc-box]:not-italic",
                ].join(" ")}
                dangerouslySetInnerHTML={{ __html: safeResolution }}
              />
            </div>
          )}

          {/* 2. Alternativas comentadas — sempre exibe quando disponíveis */}
          {commentedAlternatives.length > 0 && (
            <div className="space-y-5">
              {commentedAlternatives.map((alt) => {
                const headerLabel = isCertoErrado
                  ? `${alt.letter === "C" ? "Certo" : "Errado"} (${alt.isCorrect ? "Gabarito" : "Incorreto"})`
                  : `Alternativa ${alt.letter} (${alt.isCorrect ? "Gabarito" : "Incorreta"})`

                return (
                  <div key={alt.letter} className="space-y-1">
                    <h5 className="text-sm font-bold text-foreground">{headerLabel}</h5>

                    {!isCertoErrado && alt.text && (
                      <div
                        className="text-xs text-muted-foreground italic opacity-70"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(alt.text) }}
                      />
                    )}

                    <div
                      className="text-sm text-foreground/85 leading-relaxed font-medium"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(alt.explanation) }}
                    />
                  </div>
                )
              })}
            </div>
          )}

          {/* 3. Objetivos pedagógicos */}
          {objectives && objectives.length > 0 && (
            <div className="space-y-2 pt-2">
              <h5 className="text-sm font-bold text-foreground">Objetivos</h5>
              <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-1 font-medium">
                {objectives.map((obj, i) => (
                  <li key={i} className="leading-relaxed">{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Dica / Macete */}
          {tip && (
            <div className="space-y-1 pt-2 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <h5 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                💡 Dica / Macete
              </h5>
              <p className="text-sm text-foreground/80 leading-relaxed font-medium">{tip}</p>
            </div>
          )}

          {/* 5. Referências bibliográficas */}
          {references && references.length > 0 && (
            <div className="space-y-2 pt-2">
              <h5 className="text-sm font-bold text-foreground">Referências</h5>
              <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-1 font-medium italic">
                {references.map((ref, i) => (
                  <li key={i} className="leading-relaxed">{ref}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
