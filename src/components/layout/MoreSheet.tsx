"use client";

import { useEffect, useState } from "react";
import { DotsThree } from "@phosphor-icons/react";
import { getAuthUser, type AuthUser } from "@/src/lib/utils/clientAuth";
import { buttonStyles } from "../ui/Button";
import Modal from "../ui/Modal";
import { LogoutModal } from "../ui/LogoutButton";
import MoreMenu from "./MoreMenu";

/** Phones only: the More menu as a bottom sheet, opened from your own Profile page. */
export default function MoreSheet() {
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getAuthUser().then(setUser);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="More"
        className={buttonStyles({ variant: "ghost", size: "icon", className: "md:hidden" })}
      >
        <DotsThree weight="bold" aria-hidden="true" />
      </button>

      <Modal open={open} onClose={close} title="More" className="sm:max-w-sm">
        <MoreMenu
          user={user}
          onNavigate={close}
          onLogout={() => {
            // Swap the sheet for the confirmation instead of stacking two dialogs
            close();
            setConfirmLogout(true);
          }}
        />
      </Modal>

      <LogoutModal open={confirmLogout} onClose={() => setConfirmLogout(false)} />
    </>
  );
}
