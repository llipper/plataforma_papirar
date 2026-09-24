import { TaxonomyManagement } from "@/components/admin/taxonomy-management"

export default function DifficultyLevelsPage() {
  return <TaxonomyManagement config={{ title: "Níveis de Dificuldade", subtitle: "Gestão de complexidade", singular: "nível", kind: "difficulty" }} />
}
