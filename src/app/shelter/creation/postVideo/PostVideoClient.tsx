"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import WebTemplate from "@/src/components/template/WebTemplate";
import Button from "@/src/components/ui/Button";
import Textarea from "@/src/components/ui/Textarea";
import LinkedPetField from "@/src/components/forms/LinkedPetField";
import AvailabilityField from "@/src/components/forms/AvailabilityField";
import { VideoCamera } from "@phosphor-icons/react";
import LinkPetModal from "@/src/components/modal/LinkPetModal";
import type { PetCardProps } from "@/src/lib/types/shelters";

type Props = {
  pets: PetCardProps[];
  initialError: string | null;
};

type FormState = {
  caption: string;
  petId: string;
  adoptionStatus: "available" | "not_available" | "";
};

export default function PostVideoClient({ pets, initialError }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>({
    caption: "",
    petId: "",
    adoptionStatus: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [showPetPicker, setShowPetPicker] = useState(false);

  const selectedPet = useMemo(
    () => pets.find((pet) => pet.id === form.petId) ?? null,
    [pets, form.petId],
  );

  // Map PetCardProps to ShelterPetMini for LinkPetModal
  const modalPets = useMemo(
    () =>
      pets.map((pet) => ({
        id: pet.id,
        imageUrl: pet.imageUrl ?? null,
        petName: pet.petName ?? null,
        gender: (pet.gender ?? "unknown") as "male" | "female" | "unknown",
        shelterName: pet.shelterName ?? null,
        shelterLogo: pet.shelterLogo ?? null,
      })),
    [pets],
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }

    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file.");
      e.target.value = "";
      return;
    }

    const maxSizeMb = 100;
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Video must be ${maxSizeMb}MB or smaller.`);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!selectedFile) return setError("Choose a video to post.");
    if (!form.caption.trim()) return setError("Add a caption.");
    if (!form.petId.trim()) return setError("Choose which pet this video is about.");

    setSubmitting(true);

    try {
      const body = new FormData();
      body.append("file", selectedFile);
      body.append("petId", form.petId);
      body.append("caption", form.caption.trim());
      body.append("adoptionStatus", form.adoptionStatus);

      const res = await fetch("/api/videos", { method: "POST", body });
      const result = await res.json().catch(() => null);

      if (!res.ok) throw new Error(result?.error || "Failed to upload video.");

      router.push("/shelter/profiles/shelter");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload video.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <WebTemplate
        header="Post a video"
        main={
          <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ink">Video</span>
              {previewUrl ? (
                <video
                  src={previewUrl}
                  className="aspect-9/16 w-full rounded-lg bg-ink object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-9/16 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-card text-center transition-colors hover:bg-sunshine-wash"
                >
                  <VideoCamera size={28} className="text-ink" aria-hidden="true" />
                  <span className="text-sm font-medium text-ink">Choose a video</span>
                  <span className="px-4 text-xs text-muted">Vertical works best, up to 100 MB</span>
                </button>
              )}
              {previewUrl ? (
                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="w-fit">
                  Change video
                </Button>
              ) : null}
              <input ref={fileInputRef} type="file" accept="video/*" className="sr-only" tabIndex={-1} onChange={handleFileChange} />
            </div>

            <div className="flex flex-col gap-5">
              <Textarea
                label="Caption"
                value={form.caption}
                onChange={(e) => updateField("caption", e.target.value)}
                rows={3}
                required
              />
              <LinkedPetField pet={selectedPet} onChoose={() => setShowPetPicker(true)} />
              <AvailabilityField value={form.adoptionStatus} onChange={(v) => updateField("adoptionStatus", v)} />

              {error ? (
                <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
                  {error}
                </p>
              ) : null}

              <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full sm:w-fit">
                Post video
              </Button>
            </div>
          </form>
        }
      />
      <LinkPetModal
        open={showPetPicker}
        pets={modalPets}
        onClose={() => setShowPetPicker(false)}
        onSelect={(pet) => {
          updateField("petId", pet.id);
          setShowPetPicker(false);
        }}
      />
    </>
  );
}
