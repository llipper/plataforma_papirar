import type { SimuladoQuestion } from "./types"

const DEFAULT_QUESTIONS: SimuladoQuestion[] = [
  {
    id: "q-1",
    order: 1,
    discipline: "Língua Portuguesa",
    topic: "Interpretação de textos",
    statement:
      "Em um texto dissertativo, a tese representa a ideia central defendida pelo autor ao longo da argumentação.",
    alternatives: [
      { key: "A", text: "A afirmação está correta, pois a tese orienta os argumentos do texto." },
      { key: "B", text: "A afirmação está incorreta, pois a tese aparece apenas em textos narrativos." },
      { key: "C", text: "A tese é sempre uma citação retirada de outro autor." },
      { key: "D", text: "A tese corresponde exclusivamente ao título do texto." },
      { key: "E", text: "A tese não interfere na organização dos argumentos." },
    ],
  },
  {
    id: "q-2",
    order: 2,
    discipline: "Direito Constitucional",
    topic: "Direitos e garantias fundamentais",
    statement:
      "Os direitos fundamentais possuem aplicação imediata, sem prejuízo da necessidade de regulamentação em situações específicas.",
    alternatives: [
      { key: "A", text: "Certo apenas quando houver lei complementar." },
      { key: "B", text: "Certo, conforme a lógica de eficácia imediata dos direitos fundamentais." },
      { key: "C", text: "Errado, porque direitos fundamentais dependem sempre de decreto." },
      { key: "D", text: "Errado, pois só se aplicam nas relações entre particulares." },
      { key: "E", text: "Certo apenas para direitos políticos." },
    ],
  },
  {
    id: "q-3",
    order: 3,
    discipline: "Raciocínio Lógico",
    topic: "Proposições",
    statement:
      "Se a proposição 'Todos os servidores estudam' é verdadeira, então é correto afirmar que existe pelo menos um servidor que não estuda.",
    alternatives: [
      { key: "A", text: "A conclusão é necessariamente verdadeira." },
      { key: "B", text: "A conclusão é equivalente à proposição original." },
      { key: "C", text: "A conclusão contradiz a proposição original." },
      { key: "D", text: "A conclusão é uma tautologia." },
      { key: "E", text: "A conclusão não pode ser avaliada logicamente." },
    ],
  },
  {
    id: "q-4",
    order: 4,
    discipline: "Informática",
    topic: "Segurança da informação",
    statement:
      "A autenticação em dois fatores reduz o risco de acesso indevido quando uma senha é exposta.",
    alternatives: [
      { key: "A", text: "Sim, pois adiciona uma segunda etapa de verificação." },
      { key: "B", text: "Não, pois substitui a necessidade de senha." },
      { key: "C", text: "Não, pois impede qualquer ataque de phishing." },
      { key: "D", text: "Sim, mas apenas em redes locais sem internet." },
      { key: "E", text: "Não há relação entre autenticação e controle de acesso." },
    ],
  },
  {
    id: "q-5",
    order: 5,
    discipline: "Direito Administrativo",
    topic: "Atos administrativos",
    statement:
      "A presunção de legitimidade dos atos administrativos permite sua execução até que eventual ilegalidade seja reconhecida.",
    alternatives: [
      { key: "A", text: "A presunção torna o ato imune a controle judicial." },
      { key: "B", text: "A presunção afasta qualquer necessidade de motivação." },
      { key: "C", text: "A presunção autoriza efeitos imediatos, salvo invalidação." },
      { key: "D", text: "A presunção existe somente para atos normativos." },
      { key: "E", text: "A presunção impede revisão pela própria Administração." },
    ],
  },
]

export function getSimuladoQuestions(_simuladoId: string) {
  return DEFAULT_QUESTIONS
}
