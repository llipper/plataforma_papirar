import type { MaterialItem } from "./types"

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: "material-proposicoes-negacao",
    slug: "proposicoes-logicas-negacao",
    title: "Proposições Lógicas: Negação",
    subtitle: "Raciocínio Lógico",
    discipline: "Raciocínio Lógico",
    topic: "Proposições Lógicas",
    description:
      "Entenda o que é a negação de uma proposição, como ela altera o valor lógico e como identificar isso rapidamente em questões de concurso.",
    duration: "18 min",
    sectionsCount: 10,
    difficulty: "Básico",
    imageSrc: "/images/materials/proposicoes-logicas-negacao.png",
  },
]

export function getMaterialBySlug(slug: string) {
  return INITIAL_MATERIALS.find((material) => material.slug === slug)
}
