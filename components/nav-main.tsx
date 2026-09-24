"use client"

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

type NavItem = {
  title: string
  url?: string
  icon?: React.ReactNode
  items?: { title: string; url: string }[]
}

export function NavMain({
  label,
  items,
}: {
  label?: string
  items: NavItem[]
}) {
  const pathname = usePathname()

  const isRouteActive = (url: string) => {
    if (url === "/dashboard") return pathname === "/dashboard"
    return pathname === url || pathname.startsWith(`${url}/`)
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
          const url = item.url ?? "#"
          const isPlaceholder = url === "#" || !item.url
          const hasSubmenu = (item.items?.length ?? 0) > 0

          if (hasSubmenu) {
            const submenuActive = item.items!.some((subItem) =>
              isRouteActive(subItem.url)
            )

            return (
              <Collapsible
                key={item.title}
                defaultOpen={submenuActive}
                className="group/collapsible"
                render={<SidebarMenuItem />}
              >
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={submenuActive}
                    />
                  }
                >
                  {item.icon}
                  <span className="truncate">{item.title}</span>
                  <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items!.map((subItem) => {
                      const active = isRouteActive(subItem.url)

                      return (
                        <SidebarMenuSubItem key={subItem.url}>
                          <SidebarMenuSubButton
                            isActive={active}
                            render={<Link href={subItem.url} prefetch />}
                          >
                            <span className="truncate">{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            )
          }

          const isActive =
            !isPlaceholder && (
              url === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === url ||
                  pathname.startsWith(`${url}/`)
            )

          return (
            <SidebarMenuItem key={item.title}>
              {isPlaceholder ? (
                <SidebarMenuButton
                  tooltip={item.title}
                  disabled
                >
                  {item.icon}

                  <span>
                    {item.title}
                  </span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive}
                  render={
                    <Link
                      href={url}
                      prefetch
                    />
                  }
                >
                  {item.icon}

                  <span>
                    {item.title}
                  </span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
