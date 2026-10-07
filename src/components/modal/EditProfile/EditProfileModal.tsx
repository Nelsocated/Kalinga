"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { Camera, PencilSimple } from "@phosphor-icons/react";
import Avatar from "../../ui/Avatar";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Modal from "../../ui/Modal";

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
  /** Extra sections rendered after the fields, inside the same form. */
  children?: React.ReactNode;
  /** Blocks saving while something in `children` is still working, e.g. an upload. */
  busy?: boolean;
};

// Long-form fields get a textarea
const MULTILINE = new Set(["bio", "about"]);

/** Edit profile details and photo in a dialog. */
export default function EditProfileModal({
  title,
  triggerLabel = "Edit profile",
  fields,
  loadProfile,
  saveProfile,
  uploadAvatar,
  onSaved,
  children,
  busy = false,
}: Props) {
  const formId = useId();
  const fileId = useId();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [values, setValues] = useState<ProfileValues>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const closeModal = useCallback(() => {
    setOpen(false);
    setErrorMsg(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setErrorMsg(null);
        const profile = await loadProfile();
        if (cancelled) return;
        setAvatarUrl(profile.avatarUrl?.trim() ?? "");
        setValues(Object.fromEntries(fields.map((f) => [f.key, profile[f.key] ?? ""])));
      } catch (error) {
        if (!cancelled) setErrorMsg(error instanceof Error ? error.message : "Couldn't load your profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [open, fields, loadProfile]);

  async function handleAvatarPick(file: File) {
    if (!uploadAvatar) return;
    setErrorMsg(null);
    setUploading(true);
    try {
      setAvatarUrl(await uploadAvatar(file));
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Couldn't upload that photo.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSaving(true);
    try {
      await saveProfile({ values, avatarUrl: avatarUrl || undefined });
      onSaved?.();
      setOpen(false);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  }

  const displayName = values.full_name || values.shelter_name || "Profile";

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} icon={<PencilSimple aria-hidden="true" />}>
        {triggerLabel}
      </Button>

      <Modal
        open={open}
        onClose={closeModal}
        title={title}
        footer={
          <>
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" form={formId} variant="primary" loading={saving} disabled={loading || uploading || busy}>
              Save changes
            </Button>
          </>
        }
      >
        {loading ? (
          <p role="status" className="text-sm text-muted">
            Loading your profile…
          </p>
        ) : (
          <form id={formId} onSubmit={handleSave} className="flex flex-col gap-4">
            {uploadAvatar ? (
              <div className="flex items-center gap-4">
                <Avatar src={avatarUrl} name={displayName} size={72} />
                <label
                  htmlFor={fileId}
                  className="flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-medium text-ink transition-colors focus-within:ring-2 focus-within:ring-ink hover:bg-sunshine-wash"
                >
                  <Camera size={18} aria-hidden="true" />
                  {uploading ? "Uploading…" : "Change photo"}
                  <input
                    id={fileId}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleAvatarPick(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            ) : null}

            {fields.map((field) =>
              MULTILINE.has(field.key) ? (
                <Textarea
                  key={field.key}
                  label={field.label}
                  rows={4}
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                />
              ) : (
                <Input
                  key={field.key}
                  label={field.label}
                  type={field.type ?? "text"}
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                />
              ),
            )}

            {children}

            {errorMsg ? (
              <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
                {errorMsg}
              </p>
            ) : null}
          </form>
        )}
      </Modal>
    </>
  );
}
