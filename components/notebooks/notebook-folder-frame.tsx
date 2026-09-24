import React from "react"

interface NotebookFolderFrameProps {
  className?: string
  children?: React.ReactNode
  clipId?: string
}

/**
 * Moldura vetorial da pasta de estudos baseada nos SVGs originais do usuário
 * (public/notebook/card_black.svg e public/notebook/card_white.svg).
 * 
 * - defs/clipPath: Máscara perfeita com o contorno externo para que a capa
 *   nunca vaze ou deixe sobras nas pontas e cantos arredondados.
 * - children: Renderiza a arte da capa dentro do clip-path exato.
 * - Path 1: Aba e corpo inferior da pasta física com preenchimento opaco.
 * - Path 2: Contorno externo com stroke de 10px selando as bordas e cantos.
 */
export function NotebookFolderFrame({
  className,
  children,
  clipId = "card-clip",
}: NotebookFolderFrameProps) {
  const outerPath =
    "M5 493.996V269.055V65C5 31.8629 31.8629 5 65 5H570.303C603.44 5 630.303 31.8629 630.303 65V159.902V314.805V493.996C630.303 527.133 603.44 553.996 570.303 553.996H65C31.8629 553.996 5 527.133 5 493.996Z"

  const folderTabPath =
    "M5 493.996V289.872C5 276.768 11.1754 264.431 21.6652 256.578C28.8592 251.192 37.604 248.281 46.5906 248.281H170.839C186.212 248.281 200.684 255.536 209.883 267.853C219.082 280.17 233.554 287.425 248.928 287.425H585.605C590.275 287.425 594.922 288.088 599.406 289.396L603.638 290.63C611.906 293.042 619.075 298.26 623.912 305.387C628.077 311.523 630.303 318.769 630.303 326.185V493.996C630.303 527.133 603.44 553.996 570.303 553.996H65C31.8629 553.996 5 527.133 5 493.996Z"

  return (
    <svg
      viewBox="0 0 636 559"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Máscara exata do contorno externo */}
        <clipPath id={clipId}>
          <path d={outerPath} />
        </clipPath>
      </defs>

      {/* 1. Capa superior mascarada milimetricamente pelo contorno externo */}
      {children && <g clipPath={`url(#${clipId})`}>{children}</g>}

      {/* 2. Aba e corpo inferior da pasta física que sobrepõe a capa */}
      <path
        d={folderTabPath}
        className="fill-[#F8F8F7] stroke-[#F8F8F7] dark:fill-[#1D1E1D] dark:stroke-[#1D1D1D]"
        strokeWidth="10"
      />

      {/* 3. Contorno externo com stroke de 10px selando as pontas e cantos */}
      <path
        d={outerPath}
        className="stroke-[#F8F8F7] dark:stroke-[#1D1D1D]"
        strokeWidth="10"
      />
    </svg>
  )
}
