"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check, CheckCircle2, Save } from "lucide-react"
import { updateProfile } from "firebase/auth"

import { useAuthUser } from "@/lib/auth/use-auth-user"
import { useLocale } from "@/lib/i18n/locale-provider"
import { profileMessages } from "@/lib/i18n/messages"
import {
  profileFormMessages,
  profileLoadingMessages,
} from "@/lib/profile/messages"
import {
  EMPTY_PROFILE,
  type ProfileVisibility,
  type UserProfile,
} from "@/lib/profile/types"
import {
  getCachedUserProfile,
  loadUserProfile,
  saveUserProfile,
} from "@/lib/profile/repository"
import { validateProfile } from "@/lib/profile/validation"

type ProfileTab = "personal" | "contact" | "privacy"

const inputClass =
  "h-9 w-full border-0 border-b border-border bg-transparent px-0 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground"

export default function ProfilePage() {
  const user = useAuthUser()
  const { locale } = useLocale()

  const formText = profileFormMessages[locale]
  const profileText = profileMessages[locale]

  // Inicializa instantaneamente com o cache local ou dados básicos do Auth
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (user?.uid) {
      const cached = getCachedUserProfile(user.uid)
      if (cached) return cached
    }
    return {
      ...EMPTY_PROFILE,
      displayName: user?.displayName || user?.email?.split("@")[0] || "",
    }
  })

  // Não bloqueia a tela se já temos usuário logado
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [activeTab, setActiveTab] =
    useState<ProfileTab>("personal")

  useEffect(() => {
    if (!user) {
      return
    }

    let active = true
    const fallbackDisplayName =
      user.displayName ||
      user.email?.split("@")[0] ||
      ""

    // 1. Tenta restaurar do cache imediatamente
    const cached = getCachedUserProfile(user.uid)
    if (cached) {
      setProfile((current) => {
        if (isDirty) return current
        return {
          ...cached,
          displayName: cached.displayName || fallbackDisplayName,
        }
      })
    } else {
      setProfile((current) => {
        if (isDirty || current.displayName) return current
        return {
          ...current,
          displayName: fallbackDisplayName,
        }
      })
    }

    // 2. Busca silenciosa no Firestore em background com timeout rápido de segurança (2.5s)
    const timeout = new Promise<UserProfile | null>((resolve) =>
      window.setTimeout(() => resolve(null), 2500)
    )

    Promise.race([
      loadUserProfile(user.uid),
      timeout,
    ])
      .then((saved) => {
        if (!active || !saved) return

        setProfile((current) => {
          if (isDirty) return current
          return {
            ...saved,
            displayName:
              saved.displayName ||
              current.displayName ||
              fallbackDisplayName,
          }
        })
      })
      .catch(() => {
        // Falhas silenciosas em segundo plano não travam a tela
      })

    return () => {
      active = false
    }
  }, [isDirty, user])

  function update(
    field: keyof UserProfile,
    value: string
  ) {
    setIsDirty(true)
    setProfile((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function goToSection(section: ProfileTab) {
    setActiveTab(section)

    document
      .getElementById(section)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
  }

  async function submit(
    event: React.FormEvent
  ) {
    event.preventDefault()

    setError("")
    setMessage("")

    if (!user || !validateProfile(profile)) {
      setError(formText.invalid)
      return
    }

    setSaving(true)

    try {
      await Promise.all([
        saveUserProfile(user.uid, profile),

        updateProfile(user, {
          displayName:
            profile.displayName.trim(),
        }),
      ])

      setIsDirty(false)
      setMessage(formText.saved)
    } catch {
      setError(formText.saveError)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground">
        {profileLoadingMessages[locale]}
      </div>
    )
  }

  const tabs: {
    id: ProfileTab
    label: string
  }[] = [
      {
        id: "personal",
        label: formText.personal,
      },
      {
        id: "contact",
        label: formText.contact,
      },
      {
        id: "privacy",
        label: formText.privacy,
      },
    ]

  return (
    <main className="flex-1 overflow-auto px-4 py-5 md:px-5">
      <motion.form
        onSubmit={submit}
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="w-full"
      >
        {/* =====================================================
            PROFILE HEADER
        ===================================================== */}

        <header className="flex items-center gap-4 pb-5">
          <Image
            src={
              user?.photoURL ||
              "/logo.svg"
            }
            alt={
              profile.displayName ||
              "Perfil"
            }
            width={56}
            height={56}
            className="size-14 rounded-full object-cover ring-1 ring-border"
          />

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight">
              {profile.displayName}
            </h1>

            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>

            {user?.emailVerified && (
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-sky-600">
                <CheckCircle2 className="size-3" />

                {profileText.verified}
              </p>
            )}
          </div>
        </header>

        {/* =====================================================
            TABS
        ===================================================== */}

        <div className="border-b border-border pb-4">
          <nav
            aria-label="Seções do perfil"
            className="
              inline-flex
              max-w-full
              items-center
              gap-0.5
              overflow-x-auto
              rounded-lg
              bg-muted
              p-1
            "
          >
            {tabs.map((tab) => {
              const active =
                activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    goToSection(tab.id)
                  }
                  aria-pressed={active}
                  className={`
                    relative
                    shrink-0
                    whitespace-nowrap
                    rounded-md
                    px-3
                    py-1.5
                    text-[11px]
                    font-medium
                    outline-none
                    transition-all
                    duration-200

                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-offset-1

                    ${active
                      ? `
                          bg-background
                          text-foreground
                          shadow-sm
                          ring-1
                          ring-black/[0.04]
                          dark:ring-white/[0.06]
                        `
                      : `
                          text-muted-foreground
                          hover:bg-background/40
                          hover:text-foreground
                        `
                    }
                  `}
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* =====================================================
            PERSONAL INFORMATION
        ===================================================== */}

        <section
          id="personal"
          className="scroll-mt-5 border-b border-border py-6"
        >
          <div>
            <h2 className="text-sm font-semibold tracking-tight">
              {formText.personal}
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
              {formText.personalHelp}
            </p>
          </div>

          <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-medium">
              {formText.name}

              <input
                className={inputClass}
                value={
                  profile.displayName
                }
                maxLength={80}
                onChange={(e) =>
                  update(
                    "displayName",
                    e.target.value
                  )
                }
                required
              />
            </label>

            <label className="grid gap-1 text-xs font-medium">
              {formText.email}

              <input
                className={`${inputClass} cursor-not-allowed text-muted-foreground`}
                value={
                  user?.email || ""
                }
                disabled
              />
            </label>

            <label className="grid gap-1 text-xs font-medium sm:col-span-2">
              {formText.career}

              <input
                className={inputClass}
                value={profile.career}
                maxLength={100}
                placeholder={
                  formText.careerPlaceholder
                }
                onChange={(e) =>
                  update(
                    "career",
                    e.target.value
                  )
                }
              />
            </label>
          </div>
        </section>

        {/* =====================================================
            CONTACT
        ===================================================== */}

        <section
          id="contact"
          className="scroll-mt-5 border-b border-border py-6"
        >
          <div>
            <h2 className="text-sm font-semibold tracking-tight">
              {formText.bio}
            </h2>
          </div>

          <textarea
            className="
              mt-4
              min-h-24
              w-full
              resize-y
              border-0
              border-b
              border-border
              bg-transparent
              py-2
              text-sm
              leading-relaxed
              outline-none
              transition-colors
              placeholder:text-muted-foreground/60
              focus:border-foreground
            "
            value={profile.bio}
            maxLength={500}
            placeholder={
              formText.bioPlaceholder
            }
            onChange={(e) =>
              update(
                "bio",
                e.target.value
              )
            }
          />

          <p className="mt-1 text-right text-[10px] tabular-nums text-muted-foreground">
            {profile.bio.length}/500
          </p>

          <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-3">
            <label className="grid gap-1 text-xs font-medium">
              {formText.phone}

              <input
                className={inputClass}
                value={profile.phone}
                maxLength={30}
                onChange={(e) =>
                  update(
                    "phone",
                    e.target.value
                  )
                }
              />
            </label>

            <label className="grid gap-1 text-xs font-medium">
              {formText.instagram}

              <input
                className={inputClass}
                value={
                  profile.instagram
                }
                maxLength={80}
                onChange={(e) =>
                  update(
                    "instagram",
                    e.target.value
                  )
                }
              />
            </label>

            <label className="grid gap-1 text-xs font-medium">
              {formText.tiktok}

              <input
                className={inputClass}
                value={profile.tiktok}
                maxLength={80}
                onChange={(e) =>
                  update(
                    "tiktok",
                    e.target.value
                  )
                }
              />
            </label>
          </div>
        </section>

        {/* =====================================================
            PRIVACY
        ===================================================== */}

        <section
          id="privacy"
          className="scroll-mt-5 py-6"
        >
          <div>
            <h2 className="text-sm font-semibold tracking-tight">
              {formText.privacy}
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
              {formText.privacyHelp}
            </p>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {(
              [
                "private",
                "basic",
                "public",
              ] as ProfileVisibility[]
            ).map((value) => {
              const selected =
                profile.visibility ===
                value

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    update(
                      "visibility",
                      value
                    )
                  }
                  className={`
                    group
                    flex
                    w-full
                    items-start
                    gap-3
                    rounded-lg
                    border
                    px-3
                    py-3
                    text-left
                    transition-all
                    duration-200

                    ${selected
                      ? `
                          border-border
                          bg-muted/60
                        `
                      : `
                          border-transparent
                          hover:border-border
                          hover:bg-muted/40
                        `
                    }
                  `}
                >
                  <span
                    className={`
                      mt-0.5
                      flex
                      size-4
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-all

                      ${selected
                        ? `
                            border-foreground
                            bg-foreground
                            text-background
                          `
                        : `
                            border-border
                            bg-background
                          `
                      }
                    `}
                  >
                    {selected && (
                      <Check className="size-2.5" />
                    )}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs font-medium">
                      {
                        formText[
                        value
                        ]
                      }
                    </span>

                    <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
                      {
                        formText[
                        `${value}Help` as
                        | "privateHelp"
                        | "basicHelp"
                        | "publicHelp"
                        ]
                      }
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="flex min-h-14 items-center justify-end gap-3 border-t border-border pt-4">
          <div className="mr-auto">
            {error && (
              <p
                role="alert"
                className="text-xs text-destructive"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="text-xs text-emerald-600"
              >
                {message}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            whileHover={
              saving
                ? undefined
                : { y: -1 }
            }
            whileTap={
              saving
                ? undefined
                : { scale: 0.98 }
            }
            disabled={saving}
            className="
              inline-flex
              h-9
              items-center
              justify-center
              gap-2
              rounded-md
              bg-black
              px-4
              text-xs
              font-medium
              text-white
              transition-colors
              hover:bg-sky-500
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-sky-500
              focus-visible:ring-offset-2
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            <Save className="size-3.5" />

            {saving
              ? formText.saving
              : formText.save}
          </motion.button>
        </footer>
      </motion.form>
    </main>
  )
}