"use client"

import { onAuthStateChanged, type User } from "firebase/auth"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { firebaseAuth } from "@/lib/firebase/client"

export function AuthGate({ children, protectedRoute = false }: { children: React.ReactNode; protectedRoute?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => onAuthStateChanged(firebaseAuth, (nextUser) => { setUser(nextUser); setChecking(false) }), [])

  useEffect(() => {
    if (checking) return
    if (protectedRoute && !user) router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`)
    if (!protectedRoute && user) router.replace("/dashboard")
  }, [checking, pathname, protectedRoute, router, user])

  if (checking || (protectedRoute ? !user : !!user)) return <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">Carregando...</div>
  return children
}
