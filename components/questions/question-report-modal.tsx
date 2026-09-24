"use client"

import { useState } from "react"
import { Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface QuestionReportModalProps {
  questionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitReport?: (description: string, reason?: string) => Promise<void> | void
}

export function QuestionReportModal({
  open,
  onOpenChange,
  onSubmitReport,
}: QuestionReportModalProps) {
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!description.trim()) return

    setIsSubmitting(true)
    try {
      if (onSubmitReport) {
        await onSubmitReport(description.trim())
      }
      setFeedbackSuccess(true)
      setTimeout(() => {
        setDescription("")
        setFeedbackSuccess(false)
        onOpenChange(false)
      }, 1200)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground/90">
            <Flag className="w-4 h-4 text-red-500" />
            Reportar erro na questão
          </DialogTitle>
        </DialogHeader>

        {feedbackSuccess ? (
          <div className="py-8 text-center space-y-2 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
            <p className="text-sm font-semibold text-foreground/90">Denúncia enviada com sucesso!</p>
            <p className="text-xs text-muted-foreground">Obrigado por contribuir com a plataforma Papirar.</p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="error-description" className="text-xs font-semibold">
                O que está errado?
              </Label>
              <Textarea
                id="error-description"
                placeholder="Descreva o problema com precisão (ex: gabarito com divergência, erro de digitação, imagem corrompida...)"
                className="min-h-[120px] rounded-xl resize-none border-border/60 focus:border-primary text-xs"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight italic">
              Sua notificação será revisada por nossa equipe pedagógica.
            </p>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-xl cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
                onClick={handleSubmit}
                disabled={isSubmitting || !description.trim()}
              >
                {isSubmitting ? "Enviando..." : "Enviar Denúncia"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
