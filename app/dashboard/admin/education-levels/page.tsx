import { TaxonomyManagement } from "@/components/admin/taxonomy-management"

export default function EducationLevelsPage() {
  return <TaxonomyManagement config={{ title: "Níveis Educacionais", subtitle: "Gestão de escolaridade", singular: "nível", kind: "education" }} />
}
