"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "./Button";
import Logout from "@/public/icons/Logout.svg";

type LogoutButtonProps = {
  redirectTo?: string;
  className?: string;
  withIcon?: boolean;
};

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
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Failed to logout.");
        return;
      }

      setOpen(false);
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong while logging out.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className={`bg-white border-0 flex items-center gap-3 ${className}`}
      >
        {withIcon ? (
          <Image src={Logout} alt="logout-icon" width={25} height={25} />
        ) : null}
        <span>Log Out</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-[15px] border-2 bg-white p-5 shadow-lg">
            <p className="text-neutral-800 flex justify-center">
              Log out of your account?
            </p>

            {error ? (
              <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <div className="mt-4 flex justify-center gap-3">
              <Button
                type="button"
                onClick={() => {
                  if (loading) return;
                  setOpen(false);
                  setError("");
                }}
                disabled={loading}
                className="text-sm text-neutral-700"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="text-sm text-neutral-700"
              >
                {loading ? "Logging out..." : "Yes, log out"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
