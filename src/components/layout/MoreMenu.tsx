"use client";

import Link from "next/link";
import { CaretDown, Gear, House, Info, Lifebuoy, SignOut } from "@phosphor-icons/react";
import type { AuthUser } from "@/src/lib/utils/clientAuth";

const rowClass =
  "flex h-12 w-full cursor-pointer items-center gap-3 rounded-full px-3 text-sm font-medium text-ink transition-colors hover:bg-sunshine-wash";

const subRowClass =
  "flex h-11 w-full items-center rounded-full pr-3 pl-[2.875rem] text-sm text-ink-soft transition-colors hover:bg-sunshine-wash hover:text-ink";

const POLICIES = [
  { href: "/help", label: "Help" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

type Props = {
  user: AuthUser | null;
  /** Close the surrounding panel or sheet after a link is followed. */
  onNavigate: () => void;
  onLogout: () => void;
};

/** The More rows, shared by the sidebar panel and the phone sheet. */
export default function MoreMenu({ user, onNavigate, onLogout }: Props) {
  return (
    <nav aria-label="More" className="flex flex-col gap-1">
      {/* Folds open like the FAQ on the Help page */}
      <details className="group">
        <summary className={`${rowClass} list-none [&::-webkit-details-marker]:hidden`}>
          <Lifebuoy size={22} aria-hidden="true" />
          <span className="flex-1">Help &amp; policies</span>
          <CaretDown
            size={16}
            aria-hidden="true"
            className="transition-transform duration-200 ease-out-expo group-open:rotate-180"
          />
        </summary>
        <div className="flex flex-col pt-1">
          {POLICIES.map(({ href, label }) => (
            <Link key={href} href={href} onClick={onNavigate} className={subRowClass}>
              {label}
            </Link>
          ))}
        </div>
      </details>

      {user?.role === "user" ? (
        <Link href="/shelterSignup" onClick={onNavigate} className={rowClass}>
          <House size={22} aria-hidden="true" />
          Create a shelter
        </Link>
      ) : null}
      <Link href="/about" onClick={onNavigate} className={rowClass}>
        <Info size={22} aria-hidden="true" />
        About
      </Link>
      <Link href="/site/settings" onClick={onNavigate} className={rowClass}>
        <Gear size={22} aria-hidden="true" />
        Settings
      </Link>
      {user ? (
        <button type="button" onClick={onLogout} className={rowClass}>
          <SignOut size={22} aria-hidden="true" />
          Log out
        </button>
      ) : null}
    </nav>
  );
}
