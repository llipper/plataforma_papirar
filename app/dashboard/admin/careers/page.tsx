import { TaxonomyManagement } from "@/components/admin/taxonomy-management"

export default function CareersPage() {
  return <TaxonomyManagement config={{ title: "Carreiras e Órgãos", subtitle: "Gestão da estrutura de carreiras", singular: "carreira", kind: "careers" }} />
}
