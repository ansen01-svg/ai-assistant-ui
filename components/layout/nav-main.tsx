"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/lib/nav";

export function NavMain({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                }
                onClick={() => {
                  router.push(item.href);
                  setOpenMobile(false);
                }}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
              {!item.enabled && (
                <SidebarMenuBadge className="text-muted-foreground">
                  {item.version}
                </SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
