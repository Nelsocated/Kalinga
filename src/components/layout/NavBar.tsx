"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AuthUser } from "@/src/lib/utils/clientAuth";
import FilterModal from "../modal/FilterModal";
import { NAV_ITEMS, isActive, sidebarItemClass } from "./navItems";
import SidebarMore from "./SidebarMore";
import { useNavUser } from "./useNavUser";

/** Sidebar for tablets and desktops; phones get BottomTabBar instead. */
export default function Navbar({ user: serverUser }: { user: AuthUser | null }) {
  const user = useNavUser(serverUser);
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 z-20 hidden h-dvh w-20 shrink-0 flex-col gap-6 px-3 py-6 md:flex lg:w-60 lg:px-5">
      <Link
        href="/site/home"
        aria-label="Kalinga home"
        className="flex items-center justify-center gap-3 rounded-full px-2 lg:justify-start"
      >
        <Image src="/kalinga_logo(ver2).svg" alt="" width={40} height={40} priority />
        <span className="hidden text-xl font-bold text-sunshine lg:inline">Kalinga</span>
      </Link>

      <nav aria-label="Main" className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon, href }) => {
          // Auth-only items send signed-out users to login
          const target = href(user) ?? "/login";
          const active = isActive(pathname, href(user));
          return (
            <Link
              key={key}
              href={target}
              aria-current={active ? "page" : undefined}
              className={sidebarItemClass(active)}
            >
              <Icon size={24} weight={active ? "fill" : "regular"} aria-hidden="true" />
              <span className="sr-only lg:not-sr-only">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <FilterModal />
        <SidebarMore user={user} />
      </div>
    </aside>
  );
}
