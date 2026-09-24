"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { HugeiconsIcon } from "@hugeicons/react"

import {
  DashboardSquare01Icon,
  ChatQuestionIcon,
  BookOpenTextIcon,
  BookBookmark01Icon,
  RankingIcon,
  Analytics01Icon,
  CustomerSupportIcon,
  Book01FreeIcons,

  // Administração
  Alert02Icon,
  Book02Icon,
  Briefcase01Icon,
  Chart01Icon,
  School01Icon,
  Building02Icon,
  File01Icon,
  Note01Icon,
  Shield01Icon,
  LibraryIcon,
} from "@hugeicons/core-free-icons"

import {
  sidebarMessages,
  adminSidebarMessages,
  type Locale,
} from "@/lib/i18n/messages"

import { useLocale } from "@/lib/i18n/locale-provider"
import { useBackendSession } from "@/hooks/use-backend-session"

/* -------------------------------------------------------------------------- */
/*                            NAVEGAÇÃO PRINCIPAL                              */
/* -------------------------------------------------------------------------- */

const createNavigation = (
  text: (typeof sidebarMessages)[Locale]
) => [
  {
    title: text.dashboard,
    url: "/dashboard",
    icon: (
      <HugeiconsIcon
        icon={DashboardSquare01Icon}
        strokeWidth={2}
      />
    ),
  },

  {
    title: text.questions,
    url: "/dashboard/questions",
    icon: (
      <HugeiconsIcon
        icon={ChatQuestionIcon}
        strokeWidth={2}
      />
    ),
  },

  {
    title: text.vadeMecum,
    url: "/dashboard/vade-mecum",
    icon: (
      <HugeiconsIcon
        icon={Book01FreeIcons}
        strokeWidth={2}
      />
    ),
  },

  {
    title: text.notebook,
    url: "/dashboard/notebooks",
    icon: (
      <HugeiconsIcon
        icon={BookOpenTextIcon}
        strokeWidth={2}
      />
    ),
  },

  {
    title: text.subjects,
    url: "/dashboard/simulados",
    icon: (
      <HugeiconsIcon
        icon={BookBookmark01Icon}
        strokeWidth={2}
      />
    ),
  },

  {
    title: text.rankings,
    url: "/dashboard/rankings",
    icon: (
      <HugeiconsIcon
        icon={RankingIcon}
        strokeWidth={2}
      />
    ),
  },

  {
    title: text.statistics,
    url: "/dashboard/statistics",
    icon: (
      <HugeiconsIcon
        icon={Analytics01Icon}
        strokeWidth={2}
      />
    ),
  },

  {
    title: text.support,
    icon: (
      <HugeiconsIcon
        icon={CustomerSupportIcon}
        strokeWidth={2}
      />
    ),
    items: [
      {
        title: text.openTicket,
        url: "/dashboard/support/new",
      },
      {
        title: text.myTickets,
        url: "/dashboard/support/tickets",
      },
      {
        title: text.faq,
        url: "/dashboard/support/faq",
      },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*                              ADMINISTRAÇÃO                                  */
/* -------------------------------------------------------------------------- */

const createAdminNavigation = (
  text: (typeof adminSidebarMessages)[Locale]
) => [
  /*
   * GESTÃO DE QUESTÕES
   *
   * Esse item possui submenu.
   */
  {
    title: text.questionManagement,

    icon: (
      <HugeiconsIcon
        icon={ChatQuestionIcon}
        strokeWidth={2}
      />
    ),

    items: [
      {
        title: text.questionList,
        url: "/dashboard/admin/questions",
      },

      {
        title: text.createQuestion,
        url: "/dashboard/admin/questions/create",
      },

      {
        title: text.drafts,
        url: "/dashboard/admin/questions/drafts",
      },

      {
        title: text.review,
        url: "/dashboard/admin/questions/review",
      },

      {
        title: text.published,
        url: "/dashboard/admin/questions/published",
      },

      {
        title: text.rejected,
        url: "/dashboard/admin/questions/rejected",
      },

      {
        title: text.importQuestions,
        url: "/dashboard/admin/questions/import",
      },
    ],
  },

  /*
   * REPORT DE QUESTÕES
   */
  {
    title: text.questionReports,
    icon: (
      <HugeiconsIcon
        icon={Alert02Icon}
        strokeWidth={2}
      />
    ),
    items: [
      {
        title: text.reportList,
        url: "/dashboard/admin/question-reports",
      },
      {
        title: text.reviewReports,
        url: "/dashboard/admin/question-reports/review",
      },
      {
        title: text.resolveReports,
        url: "/dashboard/admin/question-reports/resolve",
      },
    ],
  },

  {
    title: text.createMiniSimulados,
    url: "/dashboard/admin/mini-simulados",
    icon: (
      <HugeiconsIcon
        icon={BookBookmark01Icon}
        strokeWidth={2}
      />
    ),
  },

  /*
   * DISCIPLINAS
   */
  {
    title: text.subjects,
    url: "/dashboard/admin/subjects",

    icon: (
      <HugeiconsIcon
        icon={Book02Icon}
        strokeWidth={2}
      />
    ),
  },

  /*
   * CARREIRAS
   */
  {
    title: text.careers,
    url: "/dashboard/admin/careers",

    icon: (
      <HugeiconsIcon
        icon={Briefcase01Icon}
        strokeWidth={2}
      />
    ),
  },

  {
    title: text.exams,
    url: "/dashboard/admin/exams",

    icon: (
      <HugeiconsIcon
        icon={BookBookmark01Icon}
        strokeWidth={2}
      />
    ),
  },

  /*
   * NÍVEIS DE DIFICULDADE
   */
  {
    title: text.difficultyLevels,
    url: "/dashboard/admin/difficulty-levels",

    icon: (
      <HugeiconsIcon
        icon={Chart01Icon}
        strokeWidth={2}
      />
    ),
  },

  /*
   * NÍVEIS EDUCACIONAIS
   */
  {
    title: text.educationLevels,
    url: "/dashboard/admin/education-levels",

    icon: (
      <HugeiconsIcon
        icon={School01Icon}
        strokeWidth={2}
      />
    ),
  },

  /*
   * BANCAS EXAMINADORAS
   */
  {
    title: text.examBoards,
    url: "/dashboard/admin/exam-boards",

    icon: (
      <HugeiconsIcon
        icon={Building02Icon}
        strokeWidth={2}
      />
    ),
  },

  /*
   * TIPOS DE QUESTÃO
   */
  {
    title: text.questionTypes,
    url: "/dashboard/admin/question-types",

    icon: (
      <HugeiconsIcon
        icon={File01Icon}
        strokeWidth={2}
      />
    ),
  },

  {
    title: text.accessControl,
    url: "/dashboard/admin/access",

    icon: (
      <HugeiconsIcon
        icon={Shield01Icon}
        strokeWidth={2}
      />
    ),
  },

  /*
   * CADERNOS
   */
  {
    title: text.notebooks,
    icon: (
      <HugeiconsIcon
        icon={LibraryIcon}
        strokeWidth={2}
      />
    ),
    items: [
      {
        title: text.listNotebooks,
        url: "/dashboard/admin/notebooks",
      },
      {
        title: text.createNotebook,
        url: "/dashboard/admin/notebooks/create",
      },
      {
        title: text.sharedNotebooks,
        url: "/dashboard/admin/notebooks/shared",
      },
    ],
  },

  {
    title: text.studyBlocks,
    url: "/dashboard/admin/study-blocks",

    icon: (
      <HugeiconsIcon
        icon={Note01Icon}
        strokeWidth={2}
      />
    ),
  },
]

/* -------------------------------------------------------------------------- */
/*                                SIDEBAR                                      */
/* -------------------------------------------------------------------------- */

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { locale } = useLocale()
  const { isAdmin, loading: sessionLoading } = useBackendSession()

  const text = sidebarMessages[locale]
  const adminText = adminSidebarMessages[locale]

  const navigation = React.useMemo(
    () => createNavigation(text),
    [text]
  )

  const adminNavigation = React.useMemo(
    () => createAdminNavigation(adminText),
    [adminText]
  )

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Papirar"
              render={
                <Link
                  href="/dashboard"
                  prefetch
                />
              }
            >
              <Image
                src="/logo.svg"
                alt="Papirar"
                width={32}
                height={32}
                priority
                className="size-8 rounded-lg object-contain dark:invert"
              />

              <span className="truncate text-base font-semibold">
                Papirar
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ------------------------------------------------------------------ */}
      {/* CONTENT                                                            */}
      {/* ------------------------------------------------------------------ */}

      <SidebarContent>

        {/* NAVEGAÇÃO PRINCIPAL */}
        <NavMain
          label={text.main}
          items={navigation}
        />

        {isAdmin && !sessionLoading && (
          <>
            <div className="mx-3 my-3 h-px bg-sidebar-border dark:bg-neutral-800/60" />
            <NavMain
              label={adminText.administration}
              items={adminNavigation}
            />
          </>
        )}

      </SidebarContent>

      {/* ------------------------------------------------------------------ */}
      {/* USER                                                               */}
      {/* ------------------------------------------------------------------ */}

      <SidebarFooter>
        <NavUser
          user={{
            name: "Papirar Student",
            email: "student@papirar.app",
            avatar: "/logo.svg",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
