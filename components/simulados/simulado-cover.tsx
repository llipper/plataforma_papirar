import React from "react"
import Image from "next/image"

interface SimuladoCoverProps {
  subject: string
  quote?: string
}

/**
 * Capa de alta fidelidade à imagem de referência:
 * - Mesa de estudos limpa com perspectiva e iluminação suave.
 * - Prova impressa com cabeçalho SIMULADO, matéria em fonte serif e gabarito A, B, C, D, E.
 * - Caneta executiva preta com detalhes metálicos.
 * - Caderno de capa escura fosca ao fundo direito.
 * - Frase inspiradora em caligrafia elegante.
 * - Raminho de folhas verdes naturais no canto inferior esquerdo.
 * - Marca d'água "papirar" e badge pill "SIMULADO" com cores originais.
 */
export function SimuladoCover({
  subject,
}: SimuladoCoverProps) {
  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#F4F5F7] dark:bg-[#18181B]">
      {/* Cena Ilustrada em Alta Resolução */}
      <svg
        viewBox="0 0 540 330"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Fundo suave com iluminação natural de estúdio */}
          <radialGradient id="simDeskLight" cx="45%" cy="35%" r="85%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </radialGradient>
          <radialGradient id="simDeskDark" cx="45%" cy="35%" r="85%">
            <stop offset="0%" stopColor="#27272A" />
            <stop offset="60%" stopColor="#1E1E22" />
            <stop offset="100%" stopColor="#121214" />
          </radialGradient>

          {/* Sombras suaves realistas */}
          <filter id="paperShadowMain" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-2" dy="8" stdDeviation="12" floodOpacity="0.09" floodColor="#000000" />
          </filter>
          <filter id="bookShadowBack" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="4" dy="8" stdDeviation="10" floodOpacity="0.14" floodColor="#000000" />
          </filter>
          <filter id="penShadowReal" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="3" dy="5" stdDeviation="5" floodOpacity="0.22" floodColor="#000000" />
          </filter>
        </defs>

        {/* 1. Superfície da Mesa */}
        <rect width="540" height="330" fill="url(#simDeskLight)" className="dark:hidden" />
        <rect width="540" height="330" fill="url(#simDeskDark)" className="hidden dark:block" />

        {/* 2. Caderno preto fosco ao fundo direito (com páginas brancas na lateral) */}
        <g transform="translate(420, 50) rotate(-18)" filter="url(#bookShadowBack)">
          {/* Páginas do miolo */}
          <rect x="0" y="5" width="140" height="175" rx="6" fill="#F1F5F9" />
          {/* Capa escura fosca */}
          <rect x="-4" y="0" width="140" height="175" rx="6" fill="#1E2229" />
          {/* Lombada/detalhe suave */}
          <line x1="2" y1="0" x2="2" y2="175" stroke="#333842" strokeWidth="1" />
        </g>

        {/* 3. Folhas empilhadas por baixo da prova principal */}
        <rect
          x="50"
          y="75"
          width="325"
          height="270"
          rx="6"
          fill="#E2E8F0"
          className="dark:fill-neutral-800"
          transform="rotate(-5 212 210)"
          filter="url(#paperShadowMain)"
        />
        <rect
          x="70"
          y="70"
          width="325"
          height="270"
          rx="6"
          fill="#F1F5F9"
          className="dark:fill-neutral-700"
          transform="rotate(-2 232 205)"
          filter="url(#paperShadowMain)"
        />

        {/* 4. Folha principal da prova de Simulado em perspectiva */}
        <g transform="rotate(3 250 200)" filter="url(#paperShadowMain)">
          {/* Base da folha branca */}
          <rect
            x="85"
            y="65"
            width="325"
            height="270"
            rx="6"
            fill="#FFFFFF"
            className="dark:fill-neutral-100"
          />

          {/* Cabeçalho superior: SIMULADO */}
          <text
            x="247"
            y="98"
            textAnchor="middle"
            fontSize="8"
            fontWeight="800"
            letterSpacing="2.2"
            fill="#64748B"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            SIMULADO
          </text>

          {/* Nome da Matéria em destaque serif clássico */}
          <text
            x="247"
            y="126"
            textAnchor="middle"
            fontSize="17"
            fontWeight="bold"
            fontFamily="Georgia, 'Times New Roman', serif"
            fill="#0F172A"
          >
            {subject}
          </text>
          <line x1="145" y1="138" x2="350" y2="138" stroke="#E2E8F0" strokeWidth="1.2" />

          {/* Simulação de questão com alternativas de gabarito */}
          {/* Linha do Enunciado */}
          <rect x="175" y="162" width="145" height="7" rx="3.5" fill="#E2E8F0" />
          <circle cx="155" cy="165" r="6" fill="none" stroke="#94A3B8" strokeWidth="1.2" />
          <text x="155" y="167.5" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#64748B" fontFamily="system-ui">A</text>

          {/* Alternativa B selecionada / preenchida */}
          <rect x="175" y="185" width="165" height="7" rx="3.5" fill="#CBD5E1" />
          <circle cx="155" cy="188" r="6" fill="#0F172A" />
          <text x="155" y="190.5" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#FFFFFF" fontFamily="system-ui">B</text>

          {/* Alternativa C */}
          <rect x="175" y="208" width="150" height="7" rx="3.5" fill="#E2E8F0" />
          <circle cx="155" cy="211" r="6" fill="none" stroke="#94A3B8" strokeWidth="1.2" />
          <text x="155" y="213.5" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#64748B" fontFamily="system-ui">C</text>

          {/* Alternativa D */}
          <rect x="175" y="231" width="125" height="7" rx="3.5" fill="#E2E8F0" />
          <circle cx="155" cy="234" r="6" fill="none" stroke="#94A3B8" strokeWidth="1.2" />
          <text x="155" y="236.5" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#64748B" fontFamily="system-ui">D</text>

          {/* Alternativa E */}
          <rect x="175" y="254" width="85" height="7" rx="3.5" fill="#E2E8F0" />
          <circle cx="155" cy="257" r="6" fill="none" stroke="#94A3B8" strokeWidth="1.2" />
          <text x="155" y="259.5" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#64748B" fontFamily="system-ui">E</text>
        </g>

        {/* 5. Caneta executiva elegante repousada sobre a folha */}
        <g transform="translate(372, 115) rotate(22)" filter="url(#penShadowReal)">
          {/* Corpo preto polido */}
          <rect x="-3.5" y="0" width="7" height="135" rx="3.5" fill="#090B0E" />
          {/* Anel cromado central */}
          <rect x="-3.5" y="60" width="7" height="3" fill="#D1D5DB" />
          {/* Clipe metálico superior */}
          <rect x="-1" y="10" width="2" height="50" rx="1" fill="#9CA3AF" />
          <circle cx="0" cy="8" r="2.5" fill="#D1D5DB" />
          {/* Ponteira metálica e ponta da caneta */}
          <polygon points="-3.5,135 3.5,135 0,148" fill="#4B5563" />
          <polygon points="-1,144 1,144 0,149" fill="#090B0E" />
        </g>

        {/* 6. Frase manuscrita motivacional à direita */}
        <g transform="translate(425, 115) rotate(14)">
          <text
            x="0"
            y="0"
            fontSize="12.5"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fill="#64748B"
            className="dark:fill-neutral-400"
          >
            Disciplina
          </text>
          <text
            x="0"
            y="17"
            fontSize="12"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fill="#64748B"
            className="dark:fill-neutral-400"
          >
            é o que
          </text>
          <text
            x="0"
            y="34"
            fontSize="12"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fill="#64748B"
            className="dark:fill-neutral-400"
          >
            te aproxima
          </text>
          <text
            x="0"
            y="51"
            fontSize="12"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fill="#64748B"
            className="dark:fill-neutral-400"
          >
            do seu objetivo.
          </text>
          <line x1="10" y1="63" x2="65" y2="63" stroke="#94A3B8" strokeWidth="0.9" strokeLinecap="round" />
        </g>

        {/* 7. Folhagem verde natural saindo do canto inferior esquerdo */}
        <g transform="translate(25, 235) rotate(-15)">
          <path d="M0 0 C-10 -25 -5 -50 15 -70 C22 -45 16 -18 0 0 Z" fill="#2E4A35" />
          <path d="M-5 -20 C-30 -28 -38 -46 -32 -65 C-18 -52 -12 -38 -5 -20 Z" fill="#3D5F44" />
          <path d="M5 -45 C-10 -70 -2 -90 18 -105 C25 -80 18 -60 5 -45 Z" fill="#4B7253" />
          <path d="M-8 -60 C-28 -75 -24 -95 -5 -105 C-2 -85 -4 -72 -8 -60 Z" fill="#3D5F44" />
        </g>
      </svg>

      {/* Marca d'água / Logo Papirar no canto superior esquerdo */}
      <div className="absolute top-3 left-3.5 z-20 flex items-center gap-1.5">
        <div className="relative size-4">
          <Image
            src="/logo.svg"
            alt="Papirar"
            fill
            className="object-contain dark:invert dark:brightness-200"
          />
        </div>
        <span className="text-[12px] font-bold tracking-tight text-neutral-900 dark:text-white">
          papirar
        </span>
      </div>

      {/* Badge Pill "SIMULADO" no canto superior direito */}
      <div className="absolute top-3 right-3.5 z-20">
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[9.5px] font-bold tracking-wider uppercase bg-[#EEF2FF] text-[#4F46E5] dark:bg-[#312E81]/80 dark:text-[#C7D2FE] border border-[#C7D2FE]/60 dark:border-[#4F46E5]/40 shadow-xs">
          SIMULADO
        </span>
      </div>
    </div>
  )
}
