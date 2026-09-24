"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export type NavSubItem = {
  title: string
  url: string
}

export type NavItem = {
  title: string
  url?: string
  icon?: React.ReactNode
  items?: NavSubItem[]
}

type NavMainProps = {
  items: NavItem[]
  label?: string
}

export function NavMain({
  items,
  label,
}: NavMainProps) {
  const pathname = usePathname()

  const isRouteActive = (url: string) => {
    if (url === "#") {
      return false
    }

    if (url === "/dashboard") {
      return pathname === "/dashboard"
    }

    return (
      pathname === url ||
      pathname.startsWith(`${url}/`)
    )
  }

  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel>
          {label}
        </SidebarGroupLabel>
      )}

      <SidebarMenu>
        {items.map((item) => {
          const hasSubmenu =
            item.items !== undefined &&
            item.items.length > 0

          /* ============================================================= */
          /* ITEM COM SUBMENU                                              */
          /* ============================================================= */

          if (hasSubmenu) {
            const submenuActive = item.items!.some(
              (subItem) =>
                isRouteActive(subItem.url)
            )

            return (
              <Collapsible
                key={item.title}
                defaultOpen={submenuActive}
                className="group/collapsible"
                render={<SidebarMenuItem />}
              >
                <SidebarMenuItem>

                  {/* BOTÃO QUE ABRE O SUBMENU */}
                  <CollapsibleTrigger render={<SidebarMenuButton tooltip={item.title} isActive={submenuActive} />}>
                      {item.icon}

                      <span className="truncate">
                        {item.title}
                      </span>

                      <ChevronRight
                        className="
                          ml-auto
                          size-4
                          shrink-0
                          transition-transform
                          duration-200
                          group-data-[state=open]/collapsible:rotate-90
                        "
                      />
                  </CollapsibleTrigger>

                  {/* SUBMENU */}
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items!.map(
                        (subItem) => {
                          const active =
                            isRouteActive(
                              subItem.url
                            )

                          return (
                            <SidebarMenuSubItem
                              key={
                                subItem.url
                              }
                            >
                              <SidebarMenuSubButton
                                isActive={
                                  active
                                }
                                render={
                                  <Link
                                    href={
                                      subItem.url
                                    }
                                    prefetch
                                  />
                                }
                              >
                                <span className="truncate">
                                  {
                                    subItem.title
                                  }
                                </span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        }
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>

                </SidebarMenuItem>
              </Collapsible>
            )
          }

          /* ============================================================= */
          /* ITEM SEM SUBMENU E SEM URL                                    */
          /* ============================================================= */

          if (!item.url) {
            return (
              <SidebarMenuItem
                key={item.title}
              >
                <SidebarMenuButton
                  tooltip={item.title}
                  disabled
                >
                  {item.icon}

                  <span className="truncate">
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          /* ============================================================= */
          /* ITEM NORMAL                                                   */
          /* ============================================================= */

          /*
           * A partir daqui o TypeScript sabe que
           * item.url EXISTE.
           */
          const url = item.url

          const active =
            isRouteActive(url)

          return (
            <SidebarMenuItem
              key={url}
            >
              <SidebarMenuButton
                tooltip={item.title}
                isActive={active}
                render={
                  <Link
                    href={url}
                    prefetch
                  />
                }
              >
                {item.icon}

                <span className="truncate">
                  {item.title}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
