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

/** Log out, after a quick confirmation. */
export default function LogoutButton({
  redirectTo = "/login",
  className = "",
  withIcon = true,
}: LogoutButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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
      setOpen(false);
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
    setOpen(false);
    setError("");
  }

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
    </>
  );
}
