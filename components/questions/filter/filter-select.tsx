"use client"

import { useState } from "react"
import { Check, Search } from "lucide-react"
import type { QuestionFilterOption } from "@/lib/questions/filter/types"
import { Combobox, ComboboxContent, ComboboxInput, ComboboxList } from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"

type FilterSelectProps = {
  label: string
  value: string
  options: QuestionFilterOption[]
  placeholder: string
  disabled?: boolean
  onChange?: (value: string) => void
}

export function FilterSelect({ label, value, options, placeholder, disabled, onChange }: FilterSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const selectedLabel = options.find((option) => option.value === value)?.label
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

  function choose(nextValue: string) {
    onChange?.(value === nextValue ? "" : nextValue)
    setOpen(false)
    setSearchTerm("")
  }

  return (
    <div className="min-w-0 space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Combobox open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (nextOpen) setSearchTerm("") }} value={value || null} onValueChange={(nextValue) => choose(String(nextValue ?? ""))}>
        <ComboboxInput
          value={selectedLabel ?? ""}
          placeholder={placeholder}
          readOnly
          showTrigger
          disabled={disabled}
          className={`w-full [&_input]:truncate [&_input]:text-ellipsis [&_input]:overflow-hidden ${selectedLabel ? "[&_input]:font-medium [&_input]:text-foreground" : ""}`}
        />
        <ComboboxContent className="w-[var(--anchor-width)] max-w-[var(--anchor-width)] overflow-hidden">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input autoFocus placeholder="Busca rápida..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          <ComboboxList className="max-h-56 overflow-y-auto p-1">
            {filteredOptions.map((option) => {
              const selected = option.value === value
              return (
                <div key={option.value} role="option" aria-selected={selected} onClick={() => choose(option.value)} className={`flex min-w-0 cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-xs transition-colors hover:bg-foreground/10 ${selected ? "border-primary/50 bg-primary/15 font-semibold text-primary" : "border-transparent"}`}>
                  <span className={`flex size-4 shrink-0 items-center justify-center rounded border ${selected ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>{selected && <Check className="size-3" />}</span>
                  <span className="min-w-0 truncate" title={option.label}>{option.label}</span>
                </div>
              )
            })}
            {!filteredOptions.length && <div className="px-2 py-6 text-center text-xs text-muted-foreground">Nenhuma opção encontrada</div>}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
