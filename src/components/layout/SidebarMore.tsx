"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CaretUp, DotsThreeCircle } from "@phosphor-icons/react";
import type { AuthUser } from "@/src/lib/utils/clientAuth";
import { LogoutModal } from "../ui/LogoutButton";
import MoreMenu from "./MoreMenu";
import { sidebarItemClass } from "./navItems";
import { cn } from "@/src/lib/cn";

/**
 * More opens in place: on lg the rows grow upward inside the sidebar and push the rest up;
 * on the icon-only tablet sidebar they float in a small panel above the button so labels fit.
 */
export default function SidebarMore({ user }: { user: AuthUser | null }) {
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex flex-col">
      <div
        id={panelId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out-expo",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          // Tablet: float above the icon-only button; lg: sit in the sidebar's flow
          "absolute bottom-full left-0 z-20 mb-2 w-60 lg:static lg:mb-0 lg:w-auto",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="rounded-xl border border-line bg-card p-2 shadow-float lg:mb-1 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <MoreMenu
              user={user}
              onNavigate={() => setOpen(false)}
              onLogout={() => {
                setOpen(false);
                setConfirmLogout(true);
              }}
            />
          </div>
        </div>
      </div>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={sidebarItemClass(open)}
      >
        <DotsThreeCircle size={24} weight={open ? "fill" : "regular"} aria-hidden="true" />
        <span className="sr-only lg:not-sr-only lg:flex-1 lg:text-left">More</span>
        <CaretUp
          size={16}
          aria-hidden="true"
          className={cn(
            "hidden transition-transform duration-200 ease-out-expo lg:block",
            open && "rotate-180",
          )}
        />
      </button>

      <LogoutModal open={confirmLogout} onClose={() => setConfirmLogout(false)} />
    </div>
  );
}
