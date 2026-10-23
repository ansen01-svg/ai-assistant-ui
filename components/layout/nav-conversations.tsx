"use client";

import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  useConversations,
  useDeleteConversation,
} from "@/hooks/use-conversations";
import type { ConversationSummary } from "@/types/api";

export function NavConversations() {
  const { data, isPending, isError } = useConversations();
  const deleteConversation = useDeleteConversation();
  const [toDelete, setToDelete] = useState<ConversationSummary | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    deleteConversation.mutate(id, {
      onSuccess: () => {
        if (pathname === `/chat/${id}`) router.push("/chat");
        toast.success("Conversation deleted");
      },
      onError: (error) => toast.error(error.message),
    });
    setToDelete(null);
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent</SidebarGroupLabel>
      <SidebarMenu>
        {isPending &&
          Array.from({ length: 5 }, (_, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuSkeleton />
            </SidebarMenuItem>
          ))}

        {isError && (
          <p className="text-muted-foreground px-2 text-xs">
            Couldn&apos;t load chats.
          </p>
        )}

        {data?.length === 0 && (
          <p className="text-muted-foreground px-2 text-xs">
            No conversations yet.
          </p>
        )}

        {data?.map((conversation) => (
          <SidebarMenuItem key={conversation.id}>
            <SidebarMenuButton
              isActive={pathname === `/chat/${conversation.id}`}
              render={
                <Link
                  href={`/chat/${conversation.id}`}
                  onClick={() => setOpenMobile(false)}
                />
              }
            >
              <span className="truncate">
                {conversation.title || "Untitled"}
              </span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuAction showOnHover />}>
                <MoreHorizontalIcon />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setToDelete(conversation)}
                >
                  <Trash2Icon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <AlertDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{toDelete?.title || "Untitled"}&rdquo; and all its messages
              will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarGroup>
  );
}
