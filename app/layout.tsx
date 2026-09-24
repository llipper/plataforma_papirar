import { Inter } from "next/font/google"

import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { LayoutProvider } from "@/contexts/layout-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { LocaleProvider } from "@/lib/i18n/locale-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          "font-sans antialiased"
        )}
      >
        <ThemeProvider>
          <LayoutProvider>
            <TooltipProvider>
              <LocaleProvider>{children}</LocaleProvider>
            </TooltipProvider>
          </LayoutProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}

