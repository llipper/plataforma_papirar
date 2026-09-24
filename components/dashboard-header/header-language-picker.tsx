"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { localeOptions } from "@/lib/i18n/messages"
import { useLocale } from "@/lib/i18n/locale-provider"

export function HeaderLanguagePicker() {
  const { locale, setLocale } = useLocale()
  const currentOption = localeOptions.find((item) => item.locale === locale)

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label="Language"
        className="inline-flex items-center justify-center rounded-xs p-0.5 text-base hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none cursor-pointer"
      >
        {currentOption?.flagImage ? (
          <Image
            src={currentOption.flagImage}
            alt={currentOption.name}
            width={20}
            height={14}
            className="rounded-xs object-cover"
          />
        ) : (
          currentOption?.flag
        )}
      </button>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="invisible absolute top-11 right-0 z-50 w-52 translate-y-1 rounded-2xl bg-background p-2 opacity-0 shadow-lg ring-1 ring-border/50 transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
      >
        {localeOptions.map((option) => (
          <button
            key={option.locale}
            type="button"
            onClick={() => setLocale(option.locale)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs hover:bg-muted cursor-pointer ${
              locale === option.locale ? "bg-muted font-semibold" : ""
            }`}
          >
            <span className="flex size-5 items-center justify-center text-base">
              {option.flagImage ? (
                <Image
                  src={option.flagImage}
                  alt=""
                  width={20}
                  height={14}
                  className="rounded-xs object-cover"
                />
              ) : (
                option.flag
              )}
            </span>
            <span>{option.name}</span>
          </button>
        ))}
      </motion.div>
    </div>
  )
}
