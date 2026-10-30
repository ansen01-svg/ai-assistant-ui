import {
  BotIcon,
  CheckSquareIcon,
  FileTextIcon,
  MessageSquareIcon,
  PlugIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Roadmap stage that ships this feature. */
  version: string;
  /** Flip to true when the feature is built. */
  enabled: boolean;
  description: string;
};

// Single source of truth for app sections. Enabling a feature = set enabled: true and build its page.
export const mainNav: NavItem[] = [
  {
    title: "Chat",
    href: "/chat",
    icon: MessageSquareIcon,
    version: "v1",
    enabled: true,
    description: "Chat with Claude.",
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileTextIcon,
    version: "v4",
    enabled: false,
    description:
      "Upload PDFs and docs, then ask questions answered with sources (RAG).",
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquareIcon,
    version: "v3",
    enabled: false,
    description: "Tasks you and the AI create, track and complete.",
  },
  {
    title: "Integrations",
    href: "/integrations",
    icon: PlugIcon,
    version: "v5",
    enabled: false,
    description: "Connect Google Drive, GitHub, Slack and more through MCP.",
  },
  {
    title: "Agents",
    href: "/agents",
    icon: BotIcon,
    version: "v6",
    enabled: false,
    description:
      "Multi-step agents and workflows that plan, use tools and finish tasks.",
  },
];

export const secondaryNav: NavItem[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    version: "v9",
    enabled: true,
    description: "Profile, workspace, usage and API settings.",
  },
];

export const findNavItem = (href: string) =>
  [...mainNav, ...secondaryNav].find((item) => item.href === href);
