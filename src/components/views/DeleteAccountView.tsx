"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { deleteAccountAction } from "@/src/app/actions/auth";

/** Delete account, behind a typed confirmation. */
export default function DeleteAccountView() {
  const router = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDeleteAccount() {
    setLoading(true);
    setError("");
    try {
      const result = await deleteAccountAction();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.replace("/login");
      router.refresh();
    } catch {
      setError("Couldn't delete your account. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setOpenConfirm(false);
    setConfirmText("");
    setError("");
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">
          <li>Your profile and personal details are removed.</li>
          <li>Your likes, messages and applications are deleted.</li>
          <li>You can&apos;t sign in to this account again.</li>
        </ul>
        <Button variant="destructive" onClick={() => setOpenConfirm(true)} className="w-fit">
          Delete my account
        </Button>
      </div>

      <Modal
        open={openConfirm}
        onClose={closeModal}
        title="Delete your account?"
        footer={
          <>
            <Button variant="ghost" onClick={closeModal} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              loading={loading}
              disabled={confirmText !== "DELETE"}
            >
              Delete forever
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-soft">
            This can&apos;t be undone. Type <span className="font-semibold text-ink">DELETE</span> to confirm.
          </p>
          <Input
            label="Confirmation"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoComplete="off"
          />
          {error ? (
            <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
              {error}
            </p>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
