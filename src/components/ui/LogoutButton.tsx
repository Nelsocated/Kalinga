"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";
import Button from "./Button";
import Modal from "./Modal";
import { logoutAction } from "@/src/app/actions/auth";

type LogoutButtonProps = {
  redirectTo?: string;
  className?: string;
  withIcon?: boolean;
};

type LogoutModalProps = {
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
};

/** The "Log out of Kalinga?" confirmation. Owned by whoever opens it. */
export function LogoutModal({ open, onClose, redirectTo = "/login" }: LogoutModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setLoading(true);
    setError("");
    try {
      const result = await logoutAction();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onClose();
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Couldn't log you out. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function close() {
    if (loading) return;
    setError("");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Log out of Kalinga?"
      className="sm:max-w-sm"
      footer={
        <>
          <Button variant="ghost" onClick={close} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogout} loading={loading}>
            Log out
          </Button>
        </>
      }
    >
      {error ? (
        <p role="alert" className="text-sm text-reject-text">
          {error}
        </p>
      ) : (
        <p className="text-sm text-ink-soft">You can log back in any time.</p>
      )}
    </Modal>
  );
}

/** Log out, after a quick confirmation. */
export default function LogoutButton({
  redirectTo = "/login",
  className = "",
  withIcon = true,
}: LogoutButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen(true)}
        icon={withIcon ? <SignOut size={22} aria-hidden="true" /> : undefined}
        className={`justify-start ${className}`}
      >
        Log out
      </Button>

      <LogoutModal open={open} onClose={() => setOpen(false)} redirectTo={redirectTo} />
    </>
  );
}
