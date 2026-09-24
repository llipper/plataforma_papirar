"use client"

import { Inconsolata } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

import { useLocale } from "@/lib/i18n/locale-provider"
import { notFoundMessages } from "@/lib/i18n/messages"

 const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
})

export default function NotFound() {
  const { locale } = useLocale()
  const text = notFoundMessages[locale]

 

  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-[#100e0b]">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}
      <Image
        src="/404.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="
          object-cover
          saturate-[0.82]
          contrast-[0.94]
          brightness-[0.92]
        "
      />

      {/* =====================================================
          TRATAMENTO DE COR
          Deixa a imagem menos digital e mais próxima
          do aspecto envelhecido da referência.
      ===================================================== */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-[2]
          bg-[#967044]/[0.08]
          mix-blend-multiply
        "
      />

      {/* =====================================================
          VINHETA
      ===================================================== */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-[3]
          bg-[radial-gradient(circle_at_50%_42%,transparent_35%,rgba(10,8,5,0.12)_70%,rgba(10,8,5,0.32)_100%)]
        "
      />

      {/* =====================================================
          GRÃO / NOISE
          Feito somente com CSS.
      ===================================================== */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-[4]
          opacity-[0.11]
          mix-blend-soft-light
          [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_180_180%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.85%22_numOctaves=%224%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.75%22/%3E%3C/svg%3E')]
        "
      />

      {/* =====================================================
          LOGO
          Sem card, sem fundo e sem borda.
      ===================================================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute
          left-6
          top-6
          z-30
          sm:left-8
          sm:top-8
          lg:left-[42px]
          lg:top-[38px]
        "
      >
        <Link
          href="/dashboard"
          aria-label="Papirar"
          className="
            block
            opacity-40
            transition-opacity
            duration-300
            hover:opacity-80
          "
        >
          <Image
            src="/logo.svg"
            alt="Papirar"
            width={52}
            height={52}
            priority
            className="
              h-auto
              w-[42px]
              object-contain
              invert
              sm:w-[46px]
              lg:w-[50px]
            "
          />
        </Link>
      </motion.div>

      {/* =====================================================
          404 GRANDE
      ===================================================== */}
   <motion.div
  aria-hidden="true"
  initial={{
    opacity: 0,
    y: -8,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    delay: 0.15,
    duration: 1.2,
    ease: [0.22, 1, 0.36, 1],
  }}
  className={`
    ${inconsolata.className}
    pointer-events-none
    absolute
    right-[5%]
    top-[3%]
    z-10
    select-none
    whitespace-nowrap
    text-[clamp(7rem,18vw,16rem)]
    font-light
    leading-none
    tracking-[-0.07em]
    text-[#eee5d4]/25
  `}
>
  404
</motion.div>
      {/* =====================================================
          SOMBRA INFERIOR
          Mais forte como na referência.
      ===================================================== */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-10
          h-[48%]
          bg-gradient-to-t
          from-[#0d0c09]
          via-[#0d0c09]/80
          via-40%
          to-transparent
        "
      />

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          z-20
          px-6
          pb-6
          sm:px-8
          sm:pb-7
          lg:px-[42px]
          lg:pb-[34px]
        "
      >
        {/* ===================================================
            MENSAGEM
        =================================================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-xl"
        >
          <p
            className="
              font-mono
              text-[8px]
              uppercase
              tracking-[0.38em]
              text-[#eee5d4]/40
              sm:text-[9px]
            "
          >
            Error / 404
          </p>

          <p
            className="
              mt-3
              max-w-xl
              font-mono
              text-[10px]
              leading-5
              tracking-[0.025em]
              text-[#eee5d4]/65
              sm:text-[11px]
            "
          >
            {text.description}
          </p>
        </motion.div>

        {/* ===================================================
            FOOTER
        =================================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.6,
            duration: 0.8,
          }}
          className="
            mt-7
            flex
            items-center
            justify-between
            gap-6
            border-t
            border-[#eee5d4]/10
            pt-5
          "
        >
          {/* ESQUERDA */}
          <span
            className="
              hidden
              font-mono
              text-[8px]
              uppercase
              tracking-[0.28em]
              text-[#eee5d4]/30
              sm:block
            "
          >
            Papirar
          </span>

          {/* CENTRO */}
          <span
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              font-mono
              text-[8px]
              tracking-[0.15em]
              text-[#eee5d4]/25
              lg:block
            "
          >
            Explore. Aprenda. Continue.
          </span>

          {/* DIREITA */}
          <motion.div
            whileHover={{ x: -3 }}
            transition={{
              duration: 0.2,
            }}
            className="ml-auto"
          >
            <Link
              href="/dashboard"
              className="
                group
                inline-flex
                items-center
                gap-2
                font-mono
                text-[9px]
                tracking-[0.08em]
                text-[#eee5d4]/45
                transition-colors
                duration-300
                hover:text-[#eee5d4]/90
                sm:text-[10px]
              "
            >
              <ArrowLeft
                className="
                  size-3
                  transition-transform
                  duration-300
                  group-hover:-translate-x-0.5
                "
              />

              {text.back}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}