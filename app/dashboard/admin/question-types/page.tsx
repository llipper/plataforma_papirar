import { TaxonomyManagement } from "@/components/admin/taxonomy-management"

export default function QuestionTypesPage() {
  return <TaxonomyManagement config={{ title: "Tipos de Questão", subtitle: "Modelos de resposta", singular: "tipo", kind: "question-types" }} />
}
