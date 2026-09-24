"use client"

import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, ChevronDown, ChevronUp, Filter, Search, Trash2, X } from "lucide-react"
import { useLocale } from "@/lib/i18n/locale-provider"
import { questionFilterMessages } from "@/lib/questions/filter/messages"
import type { QuestionData } from "@/lib/questions/types"
import type { QuestionFilterOption } from "@/lib/questions/filter/types"
import { FilterSelect } from "./filter-select"
import { QuestionContextCarousel } from "./question-context-carousel"
import { useQuestionFilter } from "./use-question-filter"

const EMPTY_OPTIONS: QuestionFilterOption[] = []
const STATUS_OPTIONS = [
  { label: "Todas", value: "todas" },
  { label: "Resolvidas", value: "resolvidas" },
  { label: "Não resolvidas", value: "nao_resolvidas" },
  { label: "Acertei", value: "acertei" },
  { label: "Errei", value: "errei" },
]

export function QuestionFilter({ questions, onChange }: { questions: QuestionData[]; onChange: (questions: QuestionData[]) => void }) {
  const { locale } = useLocale()
  const text = questionFilterMessages[locale]
  const filter = useQuestionFilter(questions, onChange)
  const { state, options } = filter
  const update = filter.update

  return (
    <div className="group/filter mb-12 flex w-full flex-col gap-6">
      <QuestionContextCarousel options={options.institutions} value={state.institution} onChange={(value) => update("institution", value)} />
      <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all duration-500">
        <div className="flex items-center justify-between border-b border-border/10 bg-muted/5 px-6 py-4">
          <div className="flex items-center gap-3"><Filter className="size-4 text-primary/60" /><h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{text.title}</h3></div>
          <button type="button" onClick={() => filter.setIsExpanded(!filter.isExpanded)} className="group flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold text-primary transition-all hover:bg-primary/5">{filter.isExpanded ? <><ChevronUp className="size-3.5 group-hover:-translate-y-0.5" />{text.hide}</> : <><ChevronDown className="size-3.5 group-hover:translate-y-0.5" />{text.show}</>}</button>
        </div>
        <AnimatePresence initial={false}>
          {filter.isExpanded && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="space-y-6 p-6">
              <label className="relative block"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/40" /><span className="sr-only">{text.search}</span><input value={state.search} onChange={(event) => update("search", event.target.value)} placeholder={text.searchPlaceholder} className="h-10 w-full rounded-2xl border-none bg-muted/20 pl-11 text-sm outline-none focus:ring-2 focus:ring-primary/5" /></label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <FilterSelect label={text.discipline} placeholder={text.all} value={state.discipline} options={options.disciplines} onChange={(value) => update("discipline", value)} />
                <FilterSelect label={text.subject} placeholder={text.all} value={state.subject} options={options.subjects} disabled={!state.discipline} onChange={(value) => update("subject", value)} />
                <FilterSelect label={text.topic} placeholder={text.all} value={state.topic} options={options.topics} disabled={!state.subject} onChange={(value) => update("topic", value)} />
                <FilterSelect label={text.difficulty} placeholder={text.all} value={state.difficulty} options={options.difficulties} onChange={(value) => update("difficulty", value)} />
                <FilterSelect label={text.year} placeholder={text.all} value={state.year} options={options.years} onChange={(value) => update("year", value)} />
                <FilterSelect label={text.board} placeholder={text.all} value={state.board} options={options.boards} onChange={(value) => update("board", value)} />
                <FilterSelect label="Concurso" placeholder={text.all} value="" options={EMPTY_OPTIONS} disabled onChange={() => undefined} />
                <FilterSelect label={text.career} placeholder={text.all} value={state.career} options={options.careers} onChange={(value) => update("career", value)} />
                <FilterSelect label="Subcarreira" placeholder={text.all} value="" options={EMPTY_OPTIONS} disabled onChange={() => undefined} />
                <FilterSelect label="Órgão / Estado" placeholder={text.all} value={state.institution} options={options.institutions} onChange={(value) => update("institution", value)} />
                <FilterSelect label="Cargo" placeholder={text.all} value="" options={EMPTY_OPTIONS} disabled onChange={() => undefined} />
                <FilterSelect label={text.education} placeholder={text.all} value={state.educationLevel} options={options.educationLevels} onChange={(value) => update("educationLevel", value)} />
                <FilterSelect label={text.alternatives} placeholder={text.all} value={state.alternativesCount} options={options.alternativesCounts} onChange={(value) => update("alternativesCount", value)} />
                <FilterSelect label="Professor indica" placeholder={text.all} value="" options={EMPTY_OPTIONS} disabled onChange={() => undefined} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border/10 pt-6">
                <div className="flex items-center gap-6"><div className="flex items-center gap-4 border-r border-border/10 pr-6"><button type="button" className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary"><BookOpen className="size-4" />Criar simulado</button><button type="button" className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary"><BookOpen className="size-4" />Meus simulados</button></div><div className="flex items-center gap-3"><div className="w-48"><FilterSelect label="" placeholder="Cadernos do professor" options={EMPTY_OPTIONS} value="" disabled /></div><div className="w-48"><FilterSelect label="" placeholder="Status" options={STATUS_OPTIONS} value="" disabled /></div></div></div>
                <div className="flex items-center gap-6"><button type="button" onClick={filter.clear} disabled={!filter.activeFilters} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-red-500 disabled:pointer-events-none disabled:opacity-40"><Trash2 className="size-3.5" />{text.clear}</button><button type="button" className="flex h-10 items-center gap-2 rounded-2xl bg-slate-900 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-105 dark:bg-white dark:text-slate-900"><Search className="size-4" />Filtrar</button></div>
              </div>
            </div>
          </motion.div>}
        </AnimatePresence>
        {filter.activeFilters > 0 && <div className={`flex flex-wrap gap-2 px-6 pb-6 ${filter.isExpanded ? "pt-0" : "pt-4"}`}><span className="mr-2 self-center text-[9px] font-black uppercase tracking-widest text-muted-foreground/20">{filter.activeFilters} {text.active}</span><button type="button" onClick={filter.clear} className="flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-[10px] font-bold text-primary/80">{text.clear}<X className="size-3" /></button></div>}
      </div>
    </div>
  )
}
