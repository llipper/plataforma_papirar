"use client"

import { onAuthStateChanged } from "firebase/auth"
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { firebaseAuth } from "@/lib/firebase/client"

type BackendSession = {
  user: {
    id: string
    email: string
    displayName: string | null
    isActive: boolean
  }
  roles: string[]
}

export function useBackendSession() {
  const context = useContext(BackendSessionContext)

  if (!context) {
    throw new Error("useBackendSession must be used within BackendSessionProvider")
  }

  return context
}

type BackendSessionState = {
  session: BackendSession | null
  loading: boolean
  isAdmin: boolean
}

const BackendSessionContext = createContext<BackendSessionState | null>(null)

export function BackendSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<BackendSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      async function load() {
        if (!user) {
          if (!cancelled) {
            setSession(null)
            setLoading(false)
          }
          return
        }

        try {
          const token = await user.getIdToken()
          const response = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          })

          if (!response.ok) throw new Error("Backend session unavailable")
          const data = (await response.json()) as BackendSession
          if (!cancelled) setSession(data)
        } catch {
          if (!cancelled) setSession(null)
        } finally {
          if (!cancelled) setLoading(false)
        }
      }

      if (!user) {
        setLoading(false)
      } else {
        setLoading(true)
      }
      void load()
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      loading,
      isAdmin: session?.roles.includes("admin") ?? false,
    }),
    [loading, session]
  )

  return createElement(
    BackendSessionContext.Provider,
    { value },
    children
  )
}
