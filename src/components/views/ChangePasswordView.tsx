"use client";

import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { changePasswordAction, logoutAction } from "@/src/app/actions/auth";

/** Change password; the server checks the email and current password against the session. */
export default function ChangePasswordView() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("The new passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const result = await changePasswordAction({
        email: email.trim(),
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setEmail("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSuccessOpen(true);
    } catch {
      setError("Couldn't reach Kalinga. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function logInAgain() {
    setLoggingOut(true);
    try {
      await logoutAction();
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        <Input label="Account email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        <Input
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <Input
          label="Confirm new password"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        {error ? (
          <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="primary" loading={loading} className="w-fit">
          Change password
        </Button>
      </form>

      <Modal
        open={successOpen}
        onClose={logInAgain}
        title="Password changed"
        footer={
          <Button variant="primary" onClick={logInAgain} loading={loggingOut}>
            Log in again
          </Button>
        }
      >
        <p className="text-sm text-ink-soft">Your password is updated. Log in again with the new one.</p>
      </Modal>
    </>
  );
}
