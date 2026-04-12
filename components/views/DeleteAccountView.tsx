"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function DeleteAccountView() {
  const router = useRouter();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDeleteAccount() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Failed to delete account.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Something went wrong while deleting your account.");
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
      <section className="p-5">
        <div className="mb-5 flex justify-center items-center flex-col">
          <h2 className="text-subtitle font-bold text-black">
            Deleting your account will:
          </h2>
          <ul className="mt-1 text-lg text-black list-disc list-inside">
            <li>Remove your profile and personal information </li>
            <li>Delete all saved data and history </li>
            <li>Prevent you from accessing the account again</li>
          </ul>

          <div className="font-bold text-lg mt-7 text-reject text-center leading-6">
            Deleting your account will permanently
            <br />
            remove your access to Kalinga.
          </div>
        </div>

        <div className="mt-10 flex justify-center items-center">
          <button
            type="button"
            onClick={() => setOpenConfirm(true)}
            className="rounded-[15px] bg-white border-2 border-reject px-4 py-2 text-lg font-bold text-black hover:bg-reject"
          >
            Delete My Account
          </button>
        </div>
      </section>

      {openConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          <div className="relative z-10 w-125 max-w-[90%] overflow-hidden rounded-[15px] border-2 bg-white shadow-2xl">
            <div className="rounded-t-[15px] bg-primary py-2 text-center text-subtitle font-bold text-reject">
              Confirm Account Deletion
            </div>

            <div className="max-h-[75vh] space-y-4 overflow-y-auto scroll-stable p-5">
              <p className="text-description text-neutral-800">
                Type <span className="font-semibold">DELETE</span> below to
                confirm permanent account deletion.
              </p>

              <div>
                <label className="mb-2 block text-description font-medium">
                  Confirmation
                </label>
                <Input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full rounded-[15px] border px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error ? (
                <div className="rounded-[15px] bg-red-50 px-3 py-2 text-description text-red-600">
                  {error}
                </div>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="rounded-[15px] border px-4 py-2 text-description font-medium"
                >
                  Cancel
                </Button>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={loading || confirmText !== "DELETE"}
                  className="rounded-[15px] bg-reject px-4 py-2 text-description font-medium text-white disabled:opacity-60"
                >
                  {loading ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
