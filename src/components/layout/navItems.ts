import {
  Bell,
  ChatCircle,
  Compass,
  House,
  PlayCircle,
  User,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@/src/lib/cn";
import {
  getMsgRouteByRole,
  getNotifRouteByRole,
  getProfileRouteByRole,
  type AuthUser,
} from "@/src/lib/utils/clientAuth";

export type NavItem = {
  key: "home" | "explore" | "shelters" | "profile" | "notifications" | "messages";
  label: string;
  icon: Icon;
  href: (user: AuthUser | null) => string | null;
  requiresAuth: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "For You", icon: PlayCircle, href: () => "/site/home", requiresAuth: false },
  { key: "explore", label: "Explore", icon: Compass, href: () => "/site/explore", requiresAuth: false },
  { key: "shelters", label: "Shelters", icon: House, href: () => "/site/shelters", requiresAuth: false },
  { key: "profile", label: "Profile", icon: User, href: (u) => (u ? getProfileRouteByRole(u) : null), requiresAuth: true },
  { key: "notifications", label: "Notifications", icon: Bell, href: (u) => (u ? getNotifRouteByRole(u) : null), requiresAuth: true },
  { key: "messages", label: "Messages", icon: ChatCircle, href: (u) => (u ? getMsgRouteByRole(u) : null), requiresAuth: true },
];

/** Active when the current path starts with the item's href. */
export function isActive(pathname: string, href: string | null) {
  return !!href && (pathname === href || pathname.startsWith(`${href}/`));
}

/** Sidebar row style, shared by nav links and the Lookup / More triggers. */
export function sidebarItemClass(active = false) {
  return cn(
    "flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full px-3 text-sm font-medium text-ink transition-colors hover:bg-sunshine-wash lg:justify-start",
    active && "bg-sunshine-wash font-semibold",
  );
}
