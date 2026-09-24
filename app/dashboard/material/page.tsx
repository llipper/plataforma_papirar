import { MaterialGrid } from "@/components/materials"
import { INITIAL_MATERIALS } from "@/lib/materials/constants"

export default function MaterialsPage() {
  return (
    <div className="w-full p-4 sm:p-6">
      <MaterialGrid materials={INITIAL_MATERIALS} />
    </div>
  )
}
