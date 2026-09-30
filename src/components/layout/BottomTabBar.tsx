"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";
import { getAuthUser, type AuthUser } from "@/src/lib/utils/clientAuth";
import { NAV_ITEMS, isActive } from "./navItems";

const TAB_KEYS = ["home", "explore", "shelters", "messages", "profile"] as const;

/** Phone navigation; hidden from md up where the sidebar takes over. */
export default function BottomTabBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getAuthUser().then(setUser);
  }, []);

  const tabs = NAV_ITEMS.filter((i) => (TAB_KEYS as readonly string[]).includes(i.key));

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map(({ key, label, icon: Icon, href }) => {
          const active = isActive(pathname, href(user));
          return (
            <li key={key}>
              <Link
                href={href(user) ?? "/login"}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium text-ink-soft",
                  active && "text-ink",
                )}
              >
                <Icon
                  size={24}
                  weight={active ? "fill" : "regular"}
                  aria-hidden="true"
                  className={cn(active && "text-sunshine-deep")}
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
