"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { firebaseAuth } from "@/lib/firebase/client"
import { useAuthUser } from "@/lib/auth/use-auth-user"
import { useLocale } from "@/lib/i18n/locale-provider"
import { messages } from "@/lib/i18n/messages"

export function HeaderAccount() {
  const authUser = useAuthUser()
  const router = useRouter()
  const { locale } = useLocale()
  const text = messages[locale]

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={text.account}
        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-muted px-3 text-xs font-semibold text-foreground hover:bg-muted/80 cursor-pointer"
      >
        <Image
          src={authUser?.photoURL || "/logo.svg"}
          alt=""
          width={18}
          height={18}
          className="size-[18px] rounded-full object-cover"
        />
        <span>{text.account}</span>
      </button>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="invisible absolute top-11 right-0 z-50 w-60 translate-y-1 rounded-2xl bg-background p-2 opacity-0 shadow-lg ring-1 ring-border/50 transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
      >
        <div className="flex items-center gap-3 rounded-xl px-3 py-3">
          <Image
            src={authUser?.photoURL || "/logo.svg"}
            alt={authUser?.displayName || text.accountName}
            width={36}
            height={36}
            className="size-9 rounded-full bg-muted object-cover p-1"
          />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground">
              {authUser?.displayName ||
                authUser?.email?.split("@")[0] ||
                text.accountName}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {authUser?.email || text.accountEmail}
            </p>
          </div>
        </div>
        <div className="my-1 h-px bg-border" />
        <button
          type="button"
          onClick={() => router.push("/dashboard/profile")}
          className="w-full rounded-xl px-3 py-2 text-left text-xs hover:bg-muted cursor-pointer"
        >
          {text.profile}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/profile")}
          className="w-full rounded-xl px-3 py-2 text-left text-xs hover:bg-muted cursor-pointer"
        >
          {text.settings}
        </button>
        <div className="my-1 h-px bg-border" />
        <button
          type="button"
          onClick={() =>
            signOut(firebaseAuth).then(() => router.replace("/login"))
          }
          className="w-full rounded-xl px-3 py-2 text-left text-xs text-destructive hover:bg-muted cursor-pointer"
        >
          {text.signOut}
        </button>
      </motion.div>
    </div>
  )
}
