"use client";

import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import LogoutButton from "../ui/LogoutButton";

export default function ChangePasswordView() {
  const [email, setEmail] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(true);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        setCheckingEmail(true);

        const res = await fetch("/api/users", {
          method: "GET",
          cache: "no-store",
        });

        if (res.status === 401) {
          setAccountEmail("");
          return;
        }

        const data = await res.json().catch(() => null);

        const fetchedEmail =
          data?.data?.email ||
          data?.data?.contact_email ||
          data?.email ||
          data?.user?.email ||
          "";

        setAccountEmail(fetchedEmail);
      } catch {
        setAccountEmail("");
      } finally {
        setCheckingEmail(false);
      }
    }

    loadCurrentUser();
  }, []);

  async function handleChangePassword() {
    try {
      setError("");

      const trimmedEmail = email.trim();

      if (!trimmedEmail) {
        setError("Please enter your email.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(trimmedEmail)) {
        setError("Please enter a valid email address.");
        return;
      }

      if (!accountEmail) {
        setError("Unable to verify your account email right now.");
        return;
      }

      if (trimmedEmail.toLowerCase() !== accountEmail.trim().toLowerCase()) {
        setError("Email does not match your account.");
        return;
      }

      if (!currentPassword) {
        setError("Please enter your current password.");
        return;
      }

      if (!newPassword) {
        setError("Please enter a new password.");
        return;
      }

      if (!confirmNewPassword) {
        setError("Please confirm your new password.");
        return;
      }

      setLoading(true);

      const res = await fetch("/api/auth/change", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Failed to change password.");
        return;
      }

      setEmail("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSuccessOpen(true);
    } catch {
      setError("Something went wrong while changing your password.");
    } finally {
      setLoading(false);
    }
  }

  async function closeSuccessModal() {
    try {
      setLoggingOut(true);

      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // ignore logout error and still redirect
    } finally {
      setSuccessOpen(false);
      setLoggingOut(false);
      window.location.href = "/login";
    }
  }

  const border = "border-1";
  const labelClass = "w-56 shrink-0 text-right text-lg font-medium";
  const rowClass = "mx-auto flex w-full max-w-2xl items-center gap-5";
  const inputWrapClass = "flex-1";

  return (
    <>
      <section>
        <div className="w-full space-y-3 pt-3">
          <div className={rowClass}>
            <label className={labelClass}>Email:</label>
            <div className={inputWrapClass}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={checkingEmail}
                placeholder="Enter Email"
              />
            </div>
          </div>

          <div className={rowClass}>
            <label className={labelClass}>Current Password:</label>
            <div className={inputWrapClass}>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter Current Password"
              />
            </div>
          </div>

          <div className={rowClass}>
            <label className={labelClass}>New Password:</label>
            <div className={inputWrapClass}>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
              />
            </div>
          </div>

          <div className={rowClass}>
            <label className={labelClass}>Confirm New Password:</label>
            <div className={inputWrapClass}>
              <Input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm New Password"
              />
            </div>
          </div>

          {error ? (
            <p className="mx-auto max-w-2xl rounded-[15px] bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <div className="mt-8 space-y-4">
            <div className="flex justify-center gap-3">
              <Button
                type="button"
                onClick={() => {
                  setEmail("");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmNewPassword("");
                  setError("");
                }}
                disabled={loading || checkingEmail}
              >
                Clear
              </Button>

              <Button
                type="button"
                onClick={handleChangePassword}
                disabled={loading || checkingEmail}
              >
                {loading ? "Updating..." : "Change Password"}
              </Button>
            </div>

            <div className="flex justify-center mt-7">
              <LogoutButton className={border} withIcon={false} />
            </div>
          </div>
        </div>
      </section>

      {successOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
          <div className="w-full max-w-53 overflow-hidden rounded-[15px] border bg-white shadow-md">
            <div className="bg-primary px-4 py-2 text-center text-subtitle font-semibold text-white">
              Password Status
            </div>

            <div className="px-4 py-5 text-center text-description leading-tight text-black">
              Your password has
              <br />
              been changed!
            </div>

            <div className="flex justify-center pb-4">
              <Button
                type="button"
                onClick={closeSuccessModal}
                disabled={loggingOut}
              >
                {loggingOut ? "Redirecting..." : "OK"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
