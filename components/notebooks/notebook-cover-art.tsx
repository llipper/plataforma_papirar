import React from "react"
import type { NotebookTheme } from "@/lib/notebooks/types"

interface NotebookCoverArtProps {
  illustration?: string
  theme: NotebookTheme
}

/**
 * Arte de capa vetorial responsiva (SVG puro com viewBox="0 0 636 313").
 * Como é baseado em coordenadas vetoriais fixas, NUNCA se distorce,
 * NUNCA sai de posição e escala perfeitamente com qualquer nível de zoom.
 */
export function NotebookCoverArt({
  illustration,
}: NotebookCoverArtProps) {
  /* =========================================================
     1. CONSTITUIÇÃO — Bokeh dourado + Livros empilhados
  ========================================================= */
  if (illustration === "constitution") {
    return (
      <svg
        x="0"
        y="0"
        width="636"
        height="313"
        viewBox="0 0 636 313"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="constBg" cx="70%" cy="25%" r="85%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="25%" stopColor="#D97706" />
            <stop offset="55%" stopColor="#B45309" />
            <stop offset="80%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#3B1200" />
          </radialGradient>
          <linearGradient id="book1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F5F5F4" />
          </linearGradient>
          <linearGradient id="book2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E7E5E4" />
            <stop offset="100%" stopColor="#D6D3D1" />
          </linearGradient>
          <linearGradient id="book3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D6D3D1" />
            <stop offset="100%" stopColor="#A8A29E" />
          </linearGradient>
          <filter id="constShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-4" dy="8" stdDeviation="12" floodOpacity="0.35" floodColor="#000000" />
          </filter>
        </defs>

        {/* Fundo Dourado Rico */}
        <rect width="636" height="313" fill="url(#constBg)" />

        {/* Efeitos de Iluminação Bokeh */}
        <circle cx="500" cy="40" r="110" fill="#FDE047" opacity="0.35" />
        <circle cx="160" cy="90" r="80" fill="#FDE68A" opacity="0.25" />
        <circle cx="560" cy="220" r="90" fill="#F59E0B" opacity="0.2" />

        {/* Livro 3 (base) */}
        <rect
          x="380"
          y="105"
          width="215"
          height="185"
          rx="10"
          fill="url(#book3)"
          transform="rotate(-18 487 197)"
          filter="url(#constShadow)"
        />

        {/* Livro 2 (meio) */}
        <rect
          x="370"
          y="90"
          width="215"
          height="185"
          rx="10"
          fill="url(#book2)"
          transform="rotate(-12 477 182)"
          filter="url(#constShadow)"
        />

        {/* Livro 1 (frente com brasão e texto oficial) */}
        <g transform="rotate(-6 462 167)" filter="url(#constShadow)">
          <rect x="355" y="75" width="215" height="185" rx="10" fill="url(#book1)" />
          {/* Espessura lateral das páginas */}
          <path d="M355 85 Q351 167 355 250" stroke="#D6D3D1" strokeWidth="5" strokeLinecap="round" />

          {/* Brasão estilizado da República */}
          <g transform="translate(462, 125)">
            <circle cx="0" cy="0" r="22" fill="none" stroke="#D97706" strokeWidth="2.5" />
            <polygon
              points="0,-18 5,-5 18,-5 8,3 12,16 0,8 -12,16 -8,3 -18,-5 -5,-5"
              fill="#D97706"
            />
          </g>

          {/* Tipografia da Constituição */}
          <text
            x="462"
            y="172"
            textAnchor="middle"
            fontSize="14"
            fontWeight="900"
            letterSpacing="3.5"
            fill="#1C1917"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            CONSTITUIÇÃO
          </text>
          <text
            x="462"
            y="188"
            textAnchor="middle"
            fontSize="7.5"
            fontWeight="700"
            letterSpacing="1.8"
            fill="#78716C"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            REPÚBLICA FEDERATIVA DO BRASIL
          </text>
          <line x1="422" y1="200" x2="502" y2="200" stroke="#D97706" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </g>
      </svg>
    )
  }

  /* =========================================================
     2. RACIOCÍNIO LÓGICO — Bokeh roxo + Folha quadriculada
  ========================================================= */
  if (illustration === "logic") {
    return (
      <svg
        x="0"
        y="0"
        width="636"
        height="313"
        viewBox="0 0 636 313"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="logicBg" cx="65%" cy="25%" r="85%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="35%" stopColor="#6D28D9" />
            <stop offset="65%" stopColor="#4C1D95" />
            <stop offset="100%" stopColor="#1E0A3C" />
          </radialGradient>
          <pattern id="logicGrid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#C7D2FE" strokeWidth="1.2" />
          </pattern>
          <filter id="logicShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-4" dy="8" stdDeviation="12" floodOpacity="0.35" floodColor="#000000" />
          </filter>
        </defs>

        <rect width="636" height="313" fill="url(#logicBg)" />
        <circle cx="480" cy="50" r="100" fill="#C4B5FD" opacity="0.3" />
        <circle cx="180" cy="100" r="80" fill="#A78BFA" opacity="0.2" />

        {/* Folha Quadriculada com Lâmpada */}
        <g transform="rotate(-8 475 170)" filter="url(#logicShadow)">
          <rect x="365" y="75" width="220" height="190" rx="10" fill="#FFFFFF" />
          <rect x="365" y="75" width="220" height="190" rx="10" fill="url(#logicGrid)" />

          {/* Ícone de Lâmpada / Insights Lógicos */}
          <g transform="translate(475, 145)">
            <path
              d="M 0 -24 C -14 -24 -24 -14 -24 0 C -24 9 -19 16 -13 21 L -13 28 C -13 30 -11 32 -9 32 L 9 32 C 11 32 13 30 13 28 L 13 21 C 19 16 24 9 24 0 C 24 -14 14 -24 0 -24 Z"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <line x1="-8" y1="38" x2="8" y2="38" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" />
            <circle cx="0" cy="0" r="5" fill="#7C3AED" />
          </g>

          <text
            x="475"
            y="210"
            textAnchor="middle"
            fontSize="12"
            fontWeight="900"
            letterSpacing="2.5"
            fill="#5B21B6"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            RACIOCÍNIO LÓGICO
          </text>
        </g>

        {/* Caneta esferográfica inclinada */}
        <g transform="translate(560, 235) rotate(-45)">
          <rect x="-4" y="-35" width="8" height="70" rx="4" fill="#374151" />
          <polygon points="-4,-35 4,-35 0,-45" fill="#E5E7EB" />
          <rect x="-2" y="-30" width="4" height="60" fill="#6B7280" />
        </g>
      </svg>
    )
  }

  /* =========================================================
     3. DIREITO ADMINISTRATIVO — Bokeh azul + Prédio Público
  ========================================================= */
  if (illustration === "administrative") {
    return (
      <svg
        x="0"
        y="0"
        width="636"
        height="313"
        viewBox="0 0 636 313"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="admBg" cx="65%" cy="25%" r="85%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="35%" stopColor="#1D4ED8" />
            <stop offset="65%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0A193B" />
          </radialGradient>
          <linearGradient id="admCard" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#DBEAFE" />
          </linearGradient>
          <filter id="admShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-4" dy="8" stdDeviation="12" floodOpacity="0.35" floodColor="#000000" />
          </filter>
        </defs>

        <rect width="636" height="313" fill="url(#admBg)" />
        <circle cx="500" cy="50" r="100" fill="#93C5FD" opacity="0.3" />

        <g transform="rotate(-7 475 170)" filter="url(#admShadow)">
          <rect x="365" y="75" width="220" height="190" rx="10" fill="url(#admCard)" />
          {/* Prédio clássico / Colunas da Administração Pública */}
          <g transform="translate(475, 135)" stroke="#1D4ED8" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="0,-24 32,-8 -32,-8" fill="#DBEAFE" />
            <line x1="-32" y1="-8" x2="32" y2="-8" />
            <line x1="-24" y1="-4" x2="-24" y2="20" />
            <line x1="-8" y1="-4" x2="-8" y2="20" />
            <line x1="8" y1="-4" x2="8" y2="20" />
            <line x1="24" y1="-4" x2="24" y2="20" />
            <rect x="-34" y="20" width="68" height="6" fill="#1D4ED8" />
          </g>

          <text
            x="475"
            y="190"
            textAnchor="middle"
            fontSize="11.5"
            fontWeight="900"
            letterSpacing="2"
            fill="#1E3A8A"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            ADMINISTRAÇÃO PÚBLICA
          </text>
        </g>
      </svg>
    )
  }

  /* =========================================================
     4. LÍNGUA PORTUGUESA — Bokeh verde + Tipografia "Aa"
  ========================================================= */
  if (illustration === "portuguese") {
    return (
      <svg
        x="0"
        y="0"
        width="636"
        height="313"
        viewBox="0 0 636 313"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="portBg" cx="65%" cy="25%" r="85%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="35%" stopColor="#047857" />
            <stop offset="65%" stopColor="#064E3B" />
            <stop offset="100%" stopColor="#022C22" />
          </radialGradient>
          <linearGradient id="portCard" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ECFDF5" />
            <stop offset="100%" stopColor="#D1FAE5" />
          </linearGradient>
          <filter id="portShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-4" dy="8" stdDeviation="12" floodOpacity="0.35" floodColor="#000000" />
          </filter>
        </defs>

        <rect width="636" height="313" fill="url(#portBg)" />
        <circle cx="500" cy="50" r="100" fill="#6EE7B7" opacity="0.3" />

        <g transform="rotate(-7 475 170)" filter="url(#portShadow)">
          <rect x="365" y="75" width="220" height="190" rx="10" fill="url(#portCard)" />
          <text
            x="475"
            y="150"
            textAnchor="middle"
            fontSize="54"
            fontFamily="Georgia, serif"
            fontWeight="bold"
            fontStyle="italic"
            fill="#047857"
          >
            Aa
          </text>
          <text
            x="475"
            y="190"
            textAnchor="middle"
            fontSize="12"
            fontWeight="900"
            letterSpacing="2.5"
            fill="#064E3B"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            GRAMÁTICA &amp; TEXTO
          </text>
        </g>
      </svg>
    )
  }

  /* =========================================================
     5. DIREITO PENAL — Bokeh vermelho + Balança
  ========================================================= */
  if (illustration === "penal") {
    return (
      <svg
        x="0"
        y="0"
        width="636"
        height="313"
        viewBox="0 0 636 313"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="penalBg" cx="65%" cy="25%" r="85%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="35%" stopColor="#B91C1C" />
            <stop offset="65%" stopColor="#7F1D1D" />
            <stop offset="100%" stopColor="#3F0707" />
          </radialGradient>
          <linearGradient id="penalCard" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF1F2" />
            <stop offset="100%" stopColor="#FFE4E6" />
          </linearGradient>
          <filter id="penalShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-4" dy="8" stdDeviation="12" floodOpacity="0.35" floodColor="#000000" />
          </filter>
        </defs>

        <rect width="636" height="313" fill="url(#penalBg)" />
        <circle cx="500" cy="50" r="100" fill="#FCA5A5" opacity="0.3" />

        <g transform="rotate(-7 475 170)" filter="url(#penalShadow)">
          <rect x="365" y="75" width="220" height="190" rx="10" fill="url(#penalCard)" />
          {/* Balança da Justiça */}
          <g transform="translate(475, 135)" stroke="#B91C1C" strokeWidth="3" fill="none" strokeLinecap="round">
            <line x1="0" y1="-20" x2="0" y2="16" />
            <line x1="-24" y1="-14" x2="24" y2="-14" />
            {/* Prato esquerdo */}
            <path d="M-24 -14 L-32 2 L-16 2 Z" fill="#FECDD3" />
            {/* Prato direito */}
            <path d="M24 -14 L16 2 L32 2 Z" fill="#FECDD3" />
            {/* Base */}
            <line x1="-12" y1="16" x2="12" y2="16" strokeWidth="4" />
          </g>

          <text
            x="475"
            y="190"
            textAnchor="middle"
            fontSize="13"
            fontWeight="900"
            letterSpacing="3"
            fill="#991B1B"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            CÓDIGO PENAL
          </text>
        </g>
      </svg>
    )
  }

  /* =========================================================
     6. FALLBACK / TECNOLOGIA — Bokeh ciano
  ========================================================= */
  return (
    <svg
      x="0"
      y="0"
      width="636"
      height="313"
      viewBox="0 0 636 313"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="techBg" cx="65%" cy="25%" r="85%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="35%" stopColor="#0E7490" />
          <stop offset="65%" stopColor="#155E75" />
          <stop offset="100%" stopColor="#082F49" />
        </radialGradient>
        <linearGradient id="techCard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ECFEFF" />
          <stop offset="100%" stopColor="#CFFAFE" />
        </linearGradient>
        <filter id="techShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-4" dy="8" stdDeviation="12" floodOpacity="0.35" floodColor="#000000" />
        </filter>
      </defs>

      <rect width="636" height="313" fill="url(#techBg)" />
      <circle cx="500" cy="50" r="100" fill="#67E8F9" opacity="0.3" />

      <g transform="rotate(-7 475 170)" filter="url(#techShadow)">
        <rect x="365" y="75" width="220" height="190" rx="10" fill="url(#techCard)" />
        <g transform="translate(475, 135)" stroke="#0E7490" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="-24" y="-18" width="48" height="30" rx="4" />
          <line x1="-10" y1="18" x2="10" y2="18" />
          <line x1="0" y1="12" x2="0" y2="18" />
        </g>
        <text
          x="475"
          y="190"
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          letterSpacing="2"
          fill="#164E63"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          TECNOLOGIA &amp; DADOS
        </text>
      </g>
    </svg>
  )
}
