"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  Lightbulb,
  Target,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import type { MaterialItem } from "@/lib/materials/types"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const sections = [
  { id: "proposicao", label: "O que é uma proposição?" },
  { id: "negacao", label: "O que é a negação?" },
  { id: "lousa", label: "Veja isso na lousa" },
  { id: "exemplo", label: "Exemplo simples" },
  { id: "mesmo-assunto", label: "Como negar corretamente" },
  { id: "dupla-negacao", label: "Dupla negação" },
  { id: "exemplos", label: "Exemplos rápidos" },
  { id: "desigualdades", label: "Desigualdades" },
  { id: "teste", label: "Teste rápido" },
  { id: "resumo", label: "Resumo" },
]

function Section({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-border/60 py-10 first:pt-0"
    >
      <div className="mb-6 flex items-start gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
          {number}
        </span>

        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
      </div>

      <div className="space-y-5 text-[15px] leading-7 text-muted-foreground sm:text-base">
        {children}
      </div>
    </section>
  )
}

function Bizu({
  children,
  title = "BIZU",
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <div className="my-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4 sm:p-5">
      <div className="flex gap-3">
        <Lightbulb className="mt-0.5 size-5 shrink-0 text-amber-500" />

        <div>
          <p className="mb-1 text-xs font-bold tracking-wider text-amber-600 dark:text-amber-400">
            {title}
          </p>

          <div className="text-sm leading-6 text-foreground/80">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function Proposition({
  symbol = "p",
  children,
}: {
  symbol?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3 rounded-lg border bg-muted/30 p-4">
      <code className="font-semibold text-foreground">{symbol}:</code>
      <div className="text-foreground/80">{children}</div>
    </div>
  )
}

function Question({
  number,
  question,
  children,
}: {
  number: number
  question: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Questão {number}
          </span>
        </div>

        <div className="font-medium leading-7 text-foreground">{question}</div>
      </div>

      <Collapsible>
        <CollapsibleTrigger className="group flex w-full items-center justify-between border-t px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground">
          Ver resposta

          <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t bg-muted/20 p-5 text-sm leading-6">
            <div className="flex gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="text-muted-foreground">{children}</div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

type MaterialReaderProps = {
  material: MaterialItem
}

export function MaterialReader({ material }: MaterialReaderProps) {
  const mainRef = useRef<HTMLElement>(null)

  function handleReaderWheel(event: React.WheelEvent<HTMLDivElement>) {
    const main = mainRef.current

    if (!main || main.contains(event.target as Node)) return

    main.scrollTop += event.deltaY
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center border-b bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              href="/dashboard/material"
              aria-label="Voltar para materiais"
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "size-8",
              })}
            >
              <ArrowLeft className="size-4" />
            </Link>

            <div className="h-5 w-px bg-border" />

            <div className="flex min-w-0 items-center gap-2">
              <BookOpen className="size-4 shrink-0 text-muted-foreground" />

              <span className="truncate text-sm font-medium">
                {material.discipline}
              </span>
            </div>
          </div>

          <div className="ml-auto hidden shrink-0 items-center gap-2 border-l border-border/60 pl-4 text-xs text-muted-foreground sm:flex">
            <span>Material de estudo</span>
          </div>
        </div>
      </header>

      <div
        onWheel={handleReaderWheel}
        className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 gap-12 overflow-hidden px-4 py-10 sm:px-6 lg:grid-cols-[210px_minmax(0,760px)] xl:grid-cols-[210px_minmax(0,760px)_180px]"
      >
        {/* Navegação */}
        <aside className="hidden min-h-0 overflow-hidden lg:block">
          <div>
            <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Neste material
            </p>

            <nav className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-md px-2 py-1.5 text-sm leading-5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Conteúdo */}
        <main
          ref={mainRef}
          className="material-reader-scroll min-h-0 min-w-0 overflow-y-auto"
        >
          {/* Hero */}
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {material.discipline}
              </span>

              <span className="text-xs text-muted-foreground">
                {material.topic}
              </span>
            </div>

            <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {material.title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              {material.description}
            </p>
          </div>

          <Section
            id="proposicao"
            number="01"
            title="Antes de tudo: o que é uma proposição?"
          >
            <p>
              Uma <strong className="text-foreground">proposição</strong> é uma
              sentença declarativa que pode ser classificada como{" "}
              <strong className="text-foreground">verdadeira (V)</strong> ou{" "}
              <strong className="text-foreground">falsa (F)</strong>.
            </p>

            <div className="overflow-hidden rounded-xl border">
              <div className="divide-y">
                <div className="flex items-center justify-between gap-4 p-4">
                  <span className="text-foreground">
                    Brasília é a capital do Brasil.
                  </span>

                  <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    V
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-4">
                  <span className="text-foreground">
                    O Brasil fica na Europa.
                  </span>

                  <span className="rounded-md bg-red-500/10 px-2 py-1 text-xs font-bold text-red-600 dark:text-red-400">
                    F
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-4">
                  <span className="text-foreground">2 + 2 = 4.</span>

                  <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    V
                  </span>
                </div>
              </div>
            </div>

            <p>
              Uma pergunta como{" "}
              <strong className="text-foreground">
                &quot;Você estudou hoje?&quot;
              </strong>{" "}
              não é uma proposição, pois não possui, por si só, um valor lógico
              V ou F.
            </p>
          </Section>

          <Section id="negacao" number="02" title="O que é a negação?">
            <p>
              A <strong className="text-foreground">negação</strong> de uma
              proposição é outra proposição que possui o{" "}
              <strong className="text-foreground">valor lógico oposto</strong>{" "}
              ao da proposição original.
            </p>

            <p>
              Se chamarmos uma proposição de <code>p</code>, sua negação é
              representada por:
            </p>

            <div className="flex items-center justify-center rounded-xl border bg-muted/20 py-8">
              <div className="text-center">
                <div className="text-4xl font-semibold text-foreground">¬p</div>

                <div className="mt-2 text-sm text-muted-foreground">
                  lê-se &quot;não p&quot;
                </div>
              </div>
            </div>

            <h3 className="pt-2 text-base font-semibold text-foreground">
              Regra fundamental
            </h3>

            <div className="mx-auto max-w-sm overflow-hidden rounded-xl border">
              <div className="grid grid-cols-2 bg-muted/50 text-center text-sm font-semibold text-foreground">
                <div className="border-r p-3">p</div>
                <div className="p-3">¬p</div>
              </div>

              <div className="grid grid-cols-2 border-t text-center">
                <div className="border-r p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                  V
                </div>

                <div className="p-3 font-semibold text-red-600 dark:text-red-400">
                  F
                </div>
              </div>

              <div className="grid grid-cols-2 border-t text-center">
                <div className="border-r p-3 font-semibold text-red-600 dark:text-red-400">
                  F
                </div>

                <div className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                  V
                </div>
              </div>
            </div>

            <Bizu>
              A negação <strong>inverte o valor lógico</strong>, mas continua
              falando do mesmo assunto.
            </Bizu>
          </Section>

          <Section id="lousa" number="03" title="Veja isso na lousa">
            <p>
              A lousa abaixo resume visualmente a ideia de negação, seu símbolo,
              a tabela-verdade e os exemplos principais.
            </p>

            <figure className="overflow-hidden rounded-2xl border bg-muted/20">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src="/images/materials/proposicoes-logicas-negacao.png"
                  alt="Lousa explicando proposições lógicas e negação"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 760px"
                />
              </div>

              <figcaption className="border-t px-4 py-3 text-center text-xs text-muted-foreground">
                Proposições Lógicas — Negação
              </figcaption>
            </figure>

            <Bizu title="BIZU DA LOUSA">
              Pense na negação como um{" "}
              <strong>interruptor lógico</strong>. Se <code>p</code> está em V,{" "}
              <code>¬p</code> vai para F. Se <code>p</code> está em F,{" "}
              <code>¬p</code> vai para V.
            </Bizu>
          </Section>

          <Section id="exemplo" number="04" title="Exemplo simples">
            <p>Considere a proposição:</p>

            <Proposition>
              Brasília é a capital do Brasil.
            </Proposition>

            <p>
              Essa proposição é{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                verdadeira
              </strong>
              .
            </p>

            <Proposition symbol="¬p">
              Brasília <strong>não é</strong> a capital do Brasil.
            </Proposition>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground">p</div>
                <div className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  V
                </div>
              </div>

              <div className="rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground">¬p</div>
                <div className="mt-1 font-semibold text-red-600 dark:text-red-400">
                  F
                </div>
              </div>
            </div>

            <h3 className="pt-3 text-base font-semibold text-foreground">
              Agora ao contrário
            </h3>

            <Proposition>O Brasil fica na Europa.</Proposition>

            <p>
              Essa proposição é{" "}
              <strong className="text-red-600 dark:text-red-400">falsa</strong>.
              Sua negação será:
            </p>

            <Proposition symbol="¬p">
              O Brasil <strong>não fica</strong> na Europa.
            </Proposition>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground">p</div>
                <div className="mt-1 font-semibold text-red-600 dark:text-red-400">
                  F
                </div>
              </div>

              <div className="rounded-lg border p-4 text-center">
                <div className="text-xs text-muted-foreground">¬p</div>
                <div className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  V
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="mesmo-assunto"
            number="05"
            title="Negar não significa trocar toda a frase"
          >
            <p>Considere:</p>

            <Proposition>Maria é médica.</Proposition>

            <p>A negação correta é:</p>

            <Proposition symbol="¬p">
              Maria <strong>não é médica</strong>.
            </Proposition>

            <div className="space-y-2 rounded-xl border p-4">
              <p className="text-sm text-red-600 dark:text-red-400">
                ✕ Maria é professora.
              </p>

              <p className="text-sm text-red-600 dark:text-red-400">
                ✕ Maria é advogada.
              </p>

              <p className="text-sm text-red-600 dark:text-red-400">
                ✕ João não é médico.
              </p>
            </div>

            <Bizu>
              Mantenha o <strong>mesmo assunto</strong> e negue exatamente
              aquilo que está sendo afirmado.
            </Bizu>
          </Section>

          <Section
            id="dupla-negacao"
            number="06"
            title='E quando a frase já possui "não"?'
          >
            <p>Também podemos negar uma proposição negativa.</p>

            <Proposition>
              João <strong>não estuda</strong>.
            </Proposition>

            <p>Sua negação é:</p>

            <Proposition symbol="¬p">
              João <strong>estuda</strong>.
            </Proposition>

            <p>
              Em linguagem lógica, negar uma negação nos leva de volta à
              proposição original:
            </p>

            <div className="rounded-xl border bg-muted/20 p-6 text-center">
              <code className="text-xl font-semibold text-foreground">
                ¬(¬p) ≡ p
              </code>
            </div>

            <div className="overflow-hidden rounded-xl border">
              <div className="grid grid-cols-[90px_1fr] border-b p-3">
                <code>p</code>
                <span>Ana trabalha.</span>
              </div>

              <div className="grid grid-cols-[90px_1fr] border-b p-3">
                <code>¬p</code>
                <span>Ana não trabalha.</span>
              </div>

              <div className="grid grid-cols-[90px_1fr] p-3">
                <code>¬(¬p)</code>
                <span>Ana trabalha.</span>
              </div>
            </div>

            <Bizu title="BIZU DE PROVA">
              Apareceu <code>¬¬p</code>? As duas negações se anulam:{" "}
              <strong>¬¬p ≡ p</strong>.
            </Bizu>
          </Section>

          <Section id="exemplos" number="07" title="Exemplos rápidos">
            <div className="space-y-3">
              {[
                [
                  "Pedro passou no concurso.",
                  "Pedro não passou no concurso.",
                ],
                ["10 é maior que 5.", "10 não é maior que 5."],
                [
                  "O candidato entregou o documento.",
                  "O candidato não entregou o documento.",
                ],
                ["A prova não foi anulada.", "A prova foi anulada."],
              ].map(([original, negation], index) => (
                <div
                  key={original}
                  className="rounded-xl border bg-card p-4 sm:p-5"
                >
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Exemplo {index + 1}
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-3">
                      <code className="font-semibold">p</code>
                      <span className="text-foreground">{original}</span>
                    </div>

                    <div className="flex gap-3">
                      <code className="font-semibold">¬p</code>
                      <span className="text-foreground">{negation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="desigualdades"
            number="08"
            title="Cuidado com desigualdades"
          >
            <p>
              Em questões de raciocínio lógico e matemática, a negação precisa
              incluir{" "}
              <strong className="text-foreground">
                todos os casos que tornam a afirmação falsa
              </strong>
              .
            </p>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-xl border bg-muted/20 p-6 text-center">
              <code className="text-lg font-semibold text-foreground">
                x &gt; 10
              </code>

              <ArrowRight className="size-4 text-muted-foreground" />

              <code className="text-lg font-semibold text-foreground">
                x ≤ 10
              </code>
            </div>

            <p>
              Não é apenas <code>x &lt; 10</code>, porque <code>x = 10</code>{" "}
              também torna <code>x &gt; 10</code> falso.
            </p>

            <div className="overflow-hidden rounded-xl border">
              <div className="grid grid-cols-2 bg-muted/50 text-sm font-semibold text-foreground">
                <div className="border-r p-3">Proposição</div>
                <div className="p-3">Negação</div>
              </div>

              {[
                ["x > a", "x ≤ a"],
                ["x < a", "x ≥ a"],
                ["x ≥ a", "x < a"],
                ["x ≤ a", "x > a"],
                ["x = a", "x ≠ a"],
                ["x ≠ a", "x = a"],
              ].map(([left, right]) => (
                <div
                  key={left}
                  className="grid grid-cols-2 border-t text-sm"
                >
                  <code className="border-r p-3">{left}</code>
                  <code className="p-3">{right}</code>
                </div>
              ))}
            </div>

            <Bizu>
              Ao negar <code>&gt;</code> ou <code>&lt;</code>, pense em{" "}
              <strong>trocar o sentido e incluir a igualdade</strong>.
            </Bizu>
          </Section>

          <Section id="teste" number="09" title="Teste rápido">
            <div className="mb-2 flex items-center gap-2">
              <Brain className="size-5 text-muted-foreground" />

              <p className="font-medium text-foreground">
                Tente responder antes de abrir a solução.
              </p>
            </div>

            <div className="space-y-4">
              <Question
                number={1}
                question={
                  <>
                    Considere <strong>p</strong>: &quot;Carlos é servidor
                    público.&quot; Qual é a negação?
                  </>
                }
              >
                <strong className="text-foreground">
                  Carlos não é servidor público.
                </strong>

                <p className="mt-2">
                  A negação mantém Carlos e a propriedade analisada, alterando a
                  afirmação para sua negação.
                </p>
              </Question>

              <Question
                number={2}
                question={
                  <>
                    <strong>p:</strong> &quot;A Constituição não possui
                    emendas.&quot; Qual é a negação?
                  </>
                }
              >
                <strong className="text-foreground">
                  A Constituição possui emendas.
                </strong>

                <p className="mt-2">
                  A frase original já contém uma negação. Ao negá-la, obtemos a
                  afirmação correspondente.
                </p>
              </Question>

              <Question
                number={3}
                question={
                  <>
                    Considere <code>p: x ≥ 20</code>. Qual é a negação?
                  </>
                }
              >
                <strong className="text-foreground">x &lt; 20.</strong>

                <p className="mt-2">
                  Para <code>x ≥ 20</code> ser falso, <code>x</code> precisa ser
                  menor que 20.
                </p>
              </Question>

              <Question
                number={4}
                question={
                  <>
                    Se <code>p</code> é falsa, qual é o valor lógico de{" "}
                    <code>¬p</code>?
                  </>
                }
              >
                <strong className="text-emerald-600 dark:text-emerald-400">
                  Verdadeiro (V).
                </strong>

                <p className="mt-2">
                  A negação sempre possui o valor lógico oposto ao de{" "}
                  <code>p</code>.
                </p>
              </Question>
            </div>
          </Section>

          <Section id="resumo" number="10" title="Resumo para memorizar">
            <div className="rounded-2xl border bg-muted/20 p-5 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-foreground text-background">
                  <Target className="size-4" />
                </div>

                <div>
                  <p className="font-semibold text-foreground">Negação</p>
                  <p className="text-xs text-muted-foreground">
                    O essencial para a prova
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  ["Símbolo", "¬"],
                  ["Leitura", '"não"'],
                  ["p = V", "¬p = F"],
                  ["p = F", "¬p = V"],
                  ["Dupla negação", "¬¬p ≡ p"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-muted-foreground">
                      {label}
                    </span>

                    <code className="font-semibold text-foreground">
                      {value}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            <Bizu title="BIZU FINAL">
              <strong>
                Negar é fazer a proposição assumir exatamente o valor lógico
                contrário.
              </strong>

              <p className="mt-2">
                V vira F. F vira V. Em desigualdades, escreva corretamente o
                conjunto complementar.
              </p>
            </Bizu>
          </Section>

          {/* Próximo material */}
          <div className="mt-10 rounded-2xl border bg-card p-5 sm:p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Próximo passo
            </p>

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-semibold text-foreground">
                  Negação de proposições compostas
                </h3>

                <p className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">
                  Aprenda a negar conjunções, disjunções, condicionais e
                  proposições com quantificadores.
                </p>
              </div>

              <Button className="shrink-0 gap-2">
                Continuar
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </main>

        {/* Lateral direita */}
        <aside className="hidden min-h-0 overflow-hidden xl:block">
          <div className="space-y-4">
            <div className="rounded-xl border p-4">
              <p className="text-xs font-semibold text-foreground">
                Neste material
              </p>

              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[10%] rounded-full bg-foreground" />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  10 seções
                </p>
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="flex gap-2">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />

                <p className="text-xs leading-5 text-muted-foreground">
                  Os blocos de <strong className="text-foreground">BIZU</strong>{" "}
                  destacam atalhos importantes para questões de concurso.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
