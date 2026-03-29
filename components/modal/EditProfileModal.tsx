"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Edit from "@/public/buttons/Edit.svg";
import BackButton from "../ui/BackButton";

import Input from "@/components/ui/Input";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";
import {
  fetchMyUserProfile,
  patchMyUserProfile,
  uploadMyUserAvatar,
} from "@/lib/services/user/userClient";
import type { UserUpdatePayload } from "@/lib/services/user/usersService";

export default function EditProfileModal() {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_URL);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [contactEmail, setContactEmail] = useState("");

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

    async function loadProfile() {
      try {
        setLoading(true);
        resetMessages();

        const profile = await fetchMyUserProfile();
        if (cancelled) return;

        setAvatarUrl((profile.photo_url ?? "").trim() || DEFAULT_AVATAR_URL);
        setFullName(profile.full_name ?? "");
        setUsername(profile.username ?? "");
        setBio(profile.bio ?? "");
        setContactEmail(profile.contact_email ?? "");
      } catch (error: unknown) {
        if (!cancelled) {
          setErrorMsg(
            error instanceof Error ? error.message : "Failed to load profile.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function handleAvatarPick(file: File) {
    try {
      resetMessages();
      setSaving(true);

      const publicUrl = await uploadMyUserAvatar(file);
      setAvatarUrl(publicUrl);
      setSuccessMsg("Picture updated.");
    } catch (error: unknown) {
      setErrorMsg(
        error instanceof Error ? error.message : "Failed to upload picture.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    const payload: UserUpdatePayload = {
      full_name: fullName.trim(),
      username: username.trim(),
      bio: bio.trim() || undefined,
      contact_email: contactEmail.trim() || undefined,
      photo_url:
        avatarUrl && avatarUrl !== DEFAULT_AVATAR_URL ? avatarUrl : undefined,
    };

    try {
      resetMessages();
      setSaving(true);

      await patchMyUserProfile(payload);
      router.refresh();
      setSuccessMsg("Profile saved!");
    } catch (error: unknown) {
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
        className="flex w-fit items-center gap-2 rounded-xl border border-black/50 bg-primary px-4 py-2 text-sm font-semibold hover:brightness-95"
      >
        Edit Profile
        <Image src={Edit} alt="edit-button" width={20} height={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
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

                <div className="text-2xl font-semibold text-black">
                  Edit Profile
                </div>

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

                  <label className="cursor-pointer text-xs font-semibold text-black/70 hover:underline">
                    Edit Picture
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          void handleAvatarPick(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <Labeled>
                    <Labeled.Label>Full Name</Labeled.Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Labeled>

                  <Labeled>
                    <Labeled.Label>Username</Labeled.Label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Labeled>

                  <Labeled>
                    <Labeled.Label>Bio</Labeled.Label>
                    <Input
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </Labeled>

                  <Labeled>
                    <Labeled.Label>Email</Labeled.Label>
                    <Input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      type="email"
                    />
                  </Labeled>
                </div>

                <div className="mt-3 text-xs">
                  {errorMsg ? (
                    <div className="text-red-600">{errorMsg}</div>
                  ) : null}
                  {successMsg ? (
                    <div className="text-green-700">{successMsg}</div>
                  ) : null}
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

                {loading ? (
                  <div className="mt-3 text-center text-xs text-black/60">
                    Loading profile...
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Labeled({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

Labeled.Label = function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-black/70">{children}</div>
  );
};
