"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import Input from "@/components/ui/input";
import {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
  type ProfileUpdatePayload,
} from "@/lib/services/edit_profile";

import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

type EditProfileModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

export default function Edit_Profile({
  open,
  onClose,
  onSaved,
}: EditProfileModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR_URL);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [contact, setContact] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      try {
        const profile = await getMyProfile();
        if (cancelled) return;

        setAvatarUrl((profile?.avatar_url ?? "").trim() || DEFAULT_AVATAR_URL);
        setFullName(profile?.full_name ?? "");
        setUsername(profile?.username ?? "");
        setBio(profile?.bio ?? "");
        setContact(profile?.contact ?? "");
      } catch (e: any) {
        if (!cancelled) setErrorMsg(e?.message ?? "Failed to load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const canSave = useMemo(() => !saving && !loading, [saving, loading]);

  async function handleAvatarPick(file: File) {
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      setSaving(true);
      const publicUrl = await uploadMyAvatar(file);
      setAvatarUrl(publicUrl);
      setSuccessMsg("Picture updated.");
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Failed to upload picture.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload: ProfileUpdatePayload = {
      full_name: fullName.trim(),
      username: username.trim(),
      bio: bio.trim(),
      contact: contact.trim(),
      avatar_url: avatarUrl === DEFAULT_AVATAR_URL ? null : avatarUrl,
    };

    try {
      setSaving(true);
      await updateMyProfile(payload);
      setSuccessMsg("Profile saved!");
      onSaved?.();
      // onClose(); // uncomment if you want auto-close
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          className="w-full max-w-[340px] overflow-hidden rounded-2xl border-4 border-[#f3be0f] bg-[#f6f3ee] shadow-xl"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between bg-[#f3be0f] px-3 py-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-black hover:bg-black/10"
              aria-label="Close"
            >
              ←
            </button>

            <div className="text-sm font-semibold text-black">Edit Profile</div>

            <div className="w-8" />
          </div>

          <div className="p-4">
            {/* Avatar */}
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
                    if (file) handleAvatarPick(file);
                    e.currentTarget.value = "";
                  }}
                  disabled={saving || loading}
                />
              </label>
            </div>

            {/* Form (uses your Input.tsx) */}
            <div className="space-y-3">
              <Labeled>
                <Labeled.Label>Full Name</Labeled.Label>
                <Input
                  value={fullName}
                  placeholder="Full Name"
                  disabled={loading || saving}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Labeled>

              <Labeled>
                <Labeled.Label>Username</Labeled.Label>
                <Input
                  value={username}
                  placeholder="Username"
                  disabled={loading || saving}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Labeled>

              <Labeled>
                <Labeled.Label>Bio</Labeled.Label>
                <Input
                  value={bio}
                  placeholder="?"
                  disabled={loading || saving}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Labeled>

              <Labeled>
                <Labeled.Label>Contact</Labeled.Label>
                <Input
                  value={contact}
                  placeholder="email / phone"
                  disabled={loading || saving}
                  onChange={(e) => setContact(e.target.value)}
                />
              </Labeled>
            </div>

            {/* Status */}
            <div className="mt-3 min-h-[18px] text-xs">
              {errorMsg ? <div className="text-red-600">{errorMsg}</div> : null}
              {!errorMsg && successMsg ? (
                <div className="text-green-700">{successMsg}</div>
              ) : null}
            </div>

            {/* Actions */}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/5"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-xl bg-[#f3be0f] px-3 py-2 text-sm font-semibold text-black hover:brightness-95 disabled:opacity-60"
                disabled={!canSave}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

            {loading ? (
              <div className="mt-3 text-center text-xs opacity-70">
                Loading…
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Tiny helper so the labels match your screenshot */
function Labeled({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}
Labeled.Label = function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-black/70">{children}</div>
  );
};
