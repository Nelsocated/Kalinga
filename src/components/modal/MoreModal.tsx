"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DotsThreeCircle, Gear, House, Info, SignOut } from "@phosphor-icons/react";

import { getAuthUser, type AuthUser } from "@/src/lib/utils/clientAuth";
import Modal from "../ui/Modal";
import { LogoutModal } from "../ui/LogoutButton";
import { sidebarItemClass } from "../layout/navItems";

const rowClass =
  "flex h-12 w-full items-center gap-3 rounded-full px-4 text-sm font-medium text-ink transition-colors hover:bg-sunshine-wash";

export default function MoreModal() {
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getAuthUser().then(setAuthUser);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={sidebarItemClass()}>
        <DotsThreeCircle size={24} aria-hidden="true" />
        <span className="sr-only lg:not-sr-only">More</span>
      </button>

      <Modal open={open} onClose={close} title="More" className="sm:max-w-sm">
        <nav aria-label="More" className="flex flex-col gap-1">
          {authUser?.role === "user" ? (
            <Link href="/shelterSignup" onClick={close} className={rowClass}>
              <House size={22} aria-hidden="true" />
              Create a shelter
            </Link>
          ) : null}
          <Link href="/about" onClick={close} className={rowClass}>
            <Info size={22} aria-hidden="true" />
            About
          </Link>
          <Link href="/site/settings" onClick={close} className={rowClass}>
            <Gear size={22} aria-hidden="true" />
            Settings
          </Link>
          {authUser ? (
            <button
              type="button"
              onClick={() => {
                // Swap the menu for the confirmation instead of stacking two dialogs
                close();
                setConfirmLogout(true);
              }}
              className={`cursor-pointer ${rowClass}`}
            >
              <SignOut size={22} aria-hidden="true" />
              Log out
            </button>
          ) : null}
        </nav>
      </Modal>

      <LogoutModal open={confirmLogout} onClose={() => setConfirmLogout(false)} />
    </>
  );
}
