"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import Edit from "@/public/buttons/Edit.svg";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

type Field = {
  key: string;
  label: string;
  type?: string;
};

type ProfileValues = Record<string, string>;

type SaveProfileValues = {
  values: ProfileValues;
  avatarUrl?: string;
};

type Props = {
  title: string;
  triggerLabel?: string;
  fields: Field[];
  loadProfile: () => Promise<ProfileValues & { avatarUrl?: string }>;
  saveProfile: (payload: SaveProfileValues) => Promise<void>;
  uploadAvatar?: (file: File) => Promise<string>;
  onSaved?: () => void;
};

export default function EditProfileModal({
  title,
  triggerLabel = "Edit Profile",
  fields,
  loadProfile,
  saveProfile,
  uploadAvatar,
  onSaved,
}: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_URL);
  const [values, setValues] = useState<ProfileValues>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const canSave = useMemo(() => !loading && !saving, [loading, saving]);

  function resetMessages() {
    setErrorMsg(null);
    setSuccessMsg(null);
  }

  function closeModal() {
    setOpen(false);
    resetMessages();
  }

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        resetMessages();

        const profile = await loadProfile();
        if (cancelled) return;

        setAvatarUrl(profile.avatarUrl?.trim() || DEFAULT_AVATAR_URL);

        const nextValues: ProfileValues = {};
        for (const field of fields) {
          nextValues[field.key] = profile[field.key] ?? "";
        }
        setValues(nextValues);
      } catch (error) {
        if (!cancelled) {
          setErrorMsg(
            error instanceof Error ? error.message : "Failed to load profile.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [open, fields, loadProfile]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function handleAvatarPick(file: File) {
    if (!uploadAvatar) return;

    try {
      resetMessages();
      setSaving(true);

      const publicUrl = await uploadAvatar(file);
      setAvatarUrl(publicUrl);
      setSuccessMsg("Picture updated.");
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : "Failed to upload picture.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    try {
      resetMessages();
      setSaving(true);

      const payload: SaveProfileValues = {
        values,
        avatarUrl:
          avatarUrl && avatarUrl !== DEFAULT_AVATAR_URL ? avatarUrl : undefined,
      };

      await saveProfile(payload);

      setSuccessMsg("Profile saved!");
      onSaved?.();
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : "Failed to save profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-fit items-center gap-2 rounded-[15px] border border-black/50 bg-primary px-4 py-1 text-sm font-semibold hover:brightness-95"
      >
        {triggerLabel}
        <Image src={Edit} alt="edit-button" width={20} height={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              ref={dialogRef}
              className="min-w-[70svh] overflow-hidden rounded-[15px] border-2 bg-background shadow-xl"
            >
              <div className="flex items-center justify-between bg-primary px-3 py-2">
                <BackButton onClick={closeModal} />
                <div className="text-2xl font-semibold text-black">{title}</div>
                <div className="w-8" />
              </div>

              <div className="p-4">
                <div className="flex flex-col items-center gap-2 pb-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-black/10">
                    <Image
                      src={avatarUrl}
                      alt="Profile picture"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {uploadAvatar && (
                    <label className="cursor-pointer text-xs font-semibold text-black/70 hover:underline">
                      Edit Picture
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleAvatarPick(file);
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="space-y-3">
                  {fields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <div className="text-[11px] font-semibold text-black/70">
                        {field.label}
                      </div>

                      <input
                        type={field.type ?? "text"}
                        value={values[field.key] ?? ""}
                        onChange={(e) =>
                          setValues((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="w-full rounded-[15px] border border-black/10 bg-white px-3 py-2 outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-xs">
                  {errorMsg && <div className="text-red-600">{errorMsg}</div>}
                  {successMsg && (
                    <div className="text-green-700">{successMsg}</div>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-[15px] border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!canSave}
                    className="flex-1 rounded-[15px] bg-primary px-3 py-2 text-sm font-semibold"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>

                {loading && (
                  <div className="mt-3 text-center text-xs text-black/60">
                    Loading profile...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
