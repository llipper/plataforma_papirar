import { TaxonomyManagement } from "@/components/admin/taxonomy-management"

export default function SubjectsPage() {
  return <TaxonomyManagement config={{ title: "Disciplinas", subtitle: "Gestão da estrutura de conteúdo", singular: "disciplina", kind: "subjects" }} />
}
