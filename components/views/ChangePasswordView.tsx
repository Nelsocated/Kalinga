"use client";

import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import LogoutButton from "../ui/LogoutButton";
import BackButton from "../ui/BackButton";

export default function ChangePasswordView() {
  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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

  function handleContinue() {
    setError("");
    setMessage("");

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

    setStep(2);
  }

  async function handleChangePassword() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch("/api/auth/change", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
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

      setMessage("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setStep(1);
      setEmail("");
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
  const labelClass = "w-56 shrink-0 text-right text-xl font-medium";
  const rowClass = "mx-auto flex w-full max-w-xl items-center gap-5";
  const inputWrapClass = "flex-1";

  return (
    <>
      <section>
        {step === 1 ? (
          <div className="w-full space-y-10">
            <div className={rowClass}>
              <h2 className={`text-2xl font-semibold ${labelClass}`}>
                Change Password
              </h2>
            </div>

            <div className={rowClass}>
              <label className={labelClass}>Email:</label>
              <div className={inputWrapClass}>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error ? (
              <p className="mx-auto max-w-105 rounded-[15px] bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="mx-auto max-w-105 rounded-[15px] bg-green-50 px-3 py-2 text-sm text-green-600">
                {message}
              </p>
            ) : null}

            <div className="flex justify-center">
              <Button
                type="button"
                onClick={handleContinue}
                disabled={checkingEmail}
              >
                {checkingEmail ? "Checking..." : "Change Password"}
              </Button>
            </div>

            <div className="flex justify-center">
              <LogoutButton className={border} withIcon={false} />
            </div>
          </div>
        ) : (
          <div className="w-full space-y-10">
            <div className={rowClass}>
              <div className={`text-2xl font-semibold ${labelClass}`}>
                Change Password
              </div>
              <BackButton onClick={() => setStep(1)} />
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
              <p className="mx-auto max-w-105 rounded-[15px] bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="mx-auto max-w-105 rounded-[15px] bg-green-50 px-3 py-2 text-sm text-green-600">
                {message}
              </p>
            ) : null}

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                  setMessage("");
                }}
                disabled={loading}
                className="rounded-[15px] border border-reject px-4 py-2 text-sm font-medium hover:bg-reject"
              >
                Cancel
              </button>

              <Button
                type="button"
                onClick={handleChangePassword}
                disabled={loading}
              >
                {loading ? "Updating..." : "Save"}
              </Button>
            </div>
          </div>
        )}
      </section>

      {successOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
          <div className="w-full max-w-53 overflow-hidden rounded-[15px] border bg-white shadow-md">
            <div className="bg-primary px-4 py-2 text-center text-subtitle font-semibold text-black">
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
