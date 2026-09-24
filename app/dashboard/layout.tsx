"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { AuthGate } from "@/components/auth-gate"
import { useLayout } from "@/contexts/layout-context"
import { cn } from "cn"
import {
  BackendSessionProvider,
  useBackendSession,
} from "@/hooks/use-backend-session"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

function DashboardLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { variant, collapsible, side, navbarBehavior } = useLayout()
  const pathname = usePathname()
  const router = useRouter()
  const { isAdmin, loading: sessionLoading } = useBackendSession()
  const isAdminRoute = pathname.startsWith("/dashboard/admin")

  React.useEffect(() => {
    if (sessionLoading || !isAdminRoute || isAdmin) return
    router.replace("/dashboard")
  }, [isAdmin, isAdminRoute, router, sessionLoading])

  return (
    <AuthGate protectedRoute>
      {isAdminRoute && (sessionLoading || !isAdmin) ? (
        <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
          Verificando permissões...
        </div>
      ) : (
      <SidebarProvider>
        {side === "left" && (
          <AppSidebar variant={variant} collapsible={collapsible} side={side} />
        )}

        <SidebarInset className="min-w-0">
          <header
            className={cn(
              "flex h-16 shrink-0 items-center border-b border-border/60 bg-background/95 backdrop-blur-xs z-20",
              navbarBehavior === "sticky" && "sticky top-0"
            )}
          >
            <SidebarTrigger className="ml-3" />

            <Separator
              orientation="vertical"
              className="mx-3 data-[orientation=vertical]:h-4"
            />

            <DashboardHeader />
          </header>

          {/* content-container responde ao data-container do <html> via globals.css */}
          <main className="content-container">
            {children}
          </main>
        </SidebarInset>

        {side === "right" && (
          <AppSidebar variant={variant} collapsible={collapsible} side={side} />
        )}
      </SidebarProvider>
      )}
    </AuthGate>
  )
}

export default function DashboardLayout(
  props: Readonly<{
    children: React.ReactNode
  }>
) {
  return (
    <BackendSessionProvider>
      <DashboardLayoutContent {...props} />
    </BackendSessionProvider>
  )
}
