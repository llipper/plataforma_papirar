import { TaxonomyManagement } from "@/components/admin/taxonomy-management"

export default function ExamBoardsPage() {
  return <TaxonomyManagement config={{ title: "Bancas Examinadoras", subtitle: "Gestão de identidade das bancas", singular: "banca", kind: "boards" }} />
}
