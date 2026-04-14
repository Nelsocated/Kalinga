"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import BackButton from "../../ui/BackButton";
import Input from "../../ui/Input";
import Edit from "@/public/buttons/Edit(2).svg";
import { DEFAULT_AVATAR_URL } from "@/src/lib/constants/assests";

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

  const resetMessages = useCallback(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    resetMessages();
  }, [resetMessages]);

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
  }, [open, fields, loadProfile, resetMessages]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeModal]);

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
        className="flex w-fit items-center gap-2 rounded-[15px] border border-black/50 bg-primary px-7 py-1 text-description text-secondary font-semibold hover:scale-105"
      >
        {triggerLabel}
        <Image src={Edit} alt="edit-button" width={15} height={15} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          {/* Modal */}
          <div
            ref={dialogRef}
            className="relative z-10 w-125 max-w-[90%] rounded-[15px] border-2 bg-white shadow-2xl"
            aria-modal="true"
            role="dialog"
          >
            {/* Header — matches DonationModal exactly */}
            <div className="grid grid-cols-3 items-center rounded-t-[15px] bg-primary py-3 ">
              <div className="pl-4">
                <BackButton onClick={closeModal} />
              </div>
              <div className="text-center text-title font-bold text-innerbg">
                {title}
              </div>
              <div />
            </div>

            {/* Body */}
            <div className="max-h-[75vh] overflow-y-auto scroll-stable py-2 px-5">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-2 ">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-black/10">
                  <Image
                    src={avatarUrl}
                    alt="Profile picture"
                    fill
                    className="object-cover"
                  />
                </div>

                {uploadAvatar && (
                  <label className="cursor-pointer text-description font-semibold text-black/70 hover:underline">
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

              {/* Fields */}
              <div className="space-y-3">
                {fields.map((field) => (
                  <div key={field.key}>
                    <Input
                      type={field.type ?? "text"}
                      label={field.label}
                      placeholder={field.label}
                      labelClassName="text-description text-secondary font-medium"
                      value={values[field.key] ?? ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Messages */}
              {(errorMsg || successMsg) && (
                <div className="text-xs">
                  {errorMsg && <div className="text-red-600">{errorMsg}</div>}
                  {successMsg && (
                    <div className="text-green-700">{successMsg}</div>
                  )}
                </div>
              )}

              {loading && (
                <div className="text-center text-xs text-black/60">
                  Loading profile...
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-[15px] hover:scale-105  border border-black/10 bg-innerbg text-black px-3 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave}
                  className="flex-1 rounded-[15px] hover:scale-105 bg-primary px-3 py-2 text-sm text-secondary font-semibold"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
