"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDeleteTaskList, useTaskLists } from "@/hooks/use-task-lists";
import { ListTodo, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function NavTaskLists() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: lists } = useTaskLists();
  const deleteList = useDeleteTaskList();

  function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}" and all its tasks?`)) return;
    if (pathname === `/tasks/${id}`) router.push("/tasks"); // leave before it 404s
    deleteList.mutate(id);
  }

  if (!lists?.length) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Task lists</SidebarGroupLabel>
      <SidebarMenu>
        {lists?.map((list) => (
          <SidebarMenuItem key={list.id}>
            <SidebarMenuButton
              isActive={pathname === `/tasks/${list.id}`}
              render={<Link href={`/tasks/${list.id}`} />}
            >
              <ListTodo />
              <span>{list.name}</span>
            </SidebarMenuButton>
            <SidebarMenuAction
              showOnHover
              aria-label="Delete list"
              onClick={() => remove(list.id, list.name)}
            >
              <Trash2 />
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
