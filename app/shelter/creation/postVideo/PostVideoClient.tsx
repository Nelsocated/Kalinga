"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

import { getSexIcon } from "@/app/site/profiles/pets/[id]/PetProfileClient";
import WebTemplate from "@/components/template/WebTemplate";
import Button from "@/components/ui/Button";
import CharacteristicChip from "@/components/template/pet/CharacteristicChip";
import LinkPetModal from "@/components/modal/LinkPetModal";
import type { PetCardProps } from "@/lib/types/shelters";

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

    if (!selectedFile) return setError("Video file is required.");
    if (!form.caption.trim()) return setError("Caption is required.");
    if (!form.petId.trim()) return setError("Please link a pet profile.");

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
        header="Add Video"
        main={
          <div className="px-4 py-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex h-100 aspect-9/16 overflow-hidden flex-col items-center justify-center rounded-[15px] border bg-white px-3 py-4 text-center transition hover:bg-primary/10"
                  >
                    {previewUrl ? (
                      <video
                        src={previewUrl}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <>
                        <span className="text-2xl leading-none">+</span>
                        <span className="text-sm font-semibold">
                          Upload Video
                        </span>
                      </>
                    )}
                  </button>

                  <div className="relative h-100 aspect-9/16 overflow-hidden rounded-[15px] bg-primary">
                    {previewUrl ? (
                      <video
                        src={previewUrl}
                        className="h-full w-full object-cover"
                        autoPlay
                        loop
                        playsInline
                        controls
                      />
                    ) : null}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-subtitle font-semibold">Caption</label>
                  <textarea
                    value={form.caption}
                    onChange={(e) => updateField("caption", e.target.value)}
                    placeholder="Description"
                    rows={3}
                    className="resize-none rounded-[15px] border bg-white px-3 py-2 outline-none"
                    required
                  />
                </div>

                {/* Link pet */}
                <Button
                  type="button"
                  onClick={() => setShowPetPicker(true)}
                  className="bg-primary px-3 py-2 text-lg"
                >
                  Link Pet Profile
                </Button>

                {/* Selected pet preview */}
                <div className="min-h-28 rounded-[15px] border bg-white p-2">
                  {selectedPet ? (
                    <div className="flex gap-3">
                      <div className="relative h-50 w-50 overflow-hidden rounded-[15px] bg-primary">
                        {selectedPet.imageUrl ? (
                          <Image
                            src={selectedPet.imageUrl}
                            alt={selectedPet.petName || "Unknown pet"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : null}
                      </div>

                      <div className="flex-1">
                        <div className="p-1">
                          <div className="relative h-overflow-hidden rounded-[15px]">
                            <Image
                              src={selectedPet.imageUrl || ""}
                              alt={`${selectedPet.petName} photo`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="p-2">
                          <div className="flex items-center">
                            <div className="text-subtitle leading-none font-bold">
                              {selectedPet.petName}
                            </div>
                            {getSexIcon(selectedPet.gender, 20)}
                          </div>

                          <div className="flex items-center text-description leading-none">
                            <Image
                              src={
                                selectedPet.shelterLogo || DEFAULT_AVATAR_URL
                              }
                              alt={selectedPet.shelterName ?? ""}
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <span>{selectedPet.shelterName}</span>
                          </div>

                          <div className="mt-1 text-lg font-semibold">
                            Characteristics:
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {selectedPet.sex && (
                              <CharacteristicChip
                                label="Sex"
                                value={selectedPet.sex}
                              />
                            )}
                            {selectedPet.age && (
                              <CharacteristicChip
                                label="Age"
                                value={selectedPet.age}
                              />
                            )}
                            {selectedPet.size && (
                              <CharacteristicChip
                                label="Size"
                                value={selectedPet.size}
                              />
                            )}
                            {selectedPet.species && (
                              <CharacteristicChip
                                label="Species"
                                value={selectedPet.species}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-black/40">
                      No pet linked yet.
                    </div>
                  )}
                </div>

                {/* Adoption status */}
                <div>
                  <div className="text-lg font-semibold">
                    Availability for Adoption:
                  </div>
                  <div className="mt-1 flex flex-col gap-1 text-lg">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.adoptionStatus === "available"}
                        onChange={() =>
                          updateField(
                            "adoptionStatus",
                            form.adoptionStatus === "available"
                              ? ""
                              : "available",
                          )
                        }
                        className="mt-1 accent-primary"
                      />
                      Available
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.adoptionStatus === "not_available"}
                        onChange={() =>
                          updateField(
                            "adoptionStatus",
                            form.adoptionStatus === "not_available"
                              ? ""
                              : "not_available",
                          )
                        }
                        className="mt-1 accent-primary"
                      />
                      Not Available
                    </label>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-[10px] bg-red-100 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="flex justify-center pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full max-w-40"
                  >
                    {submitting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
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
