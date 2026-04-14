"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { DEFAULT_AVATAR_URL } from "@/src/lib/constants/assests";
import CharacteristicChip from "@/src/components/template/pet/CharacteristicChip";
import LinkPetModal from "@/src/components/modal/LinkPetModal";
import WebTemplate from "@/src/components/template/WebTemplate";
import { getSexIcon } from "@/src/app/site/profiles/pets/[id]/PetProfileClient";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import type { PetCardProps } from "@/src/lib/types/shelters";

type Props = {
  pets: PetCardProps[];
  initialError: string | null;
};

type FormState = {
  title: string;
  description: string;
  petId: string;
  adoptionStatus: "available" | "not_available" | "";
};

export default function WriteFosterClient({ pets, initialError }: Props) {
  const [petId, setPetId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adoptionStatus, setAdoptionStatus] = useState<
    "available" | "not_available" | ""
  >("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [openPetModal, setOpenPetModal] = useState(false);

  const selectedPet = useMemo(
    () => pets.find((pet) => pet.id === petId) ?? null,
    [pets, petId],
  );

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

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    petId: "",
    adoptionStatus: "",
  });

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!petId) {
      setError("Please select a pet.");
      return;
    }

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Story is required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/foster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petId,
          title: title.trim(),
          description: description.trim(),
          adoptionStatus,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create foster story");
      }

      setTitle("");
      setDescription("");
      setPetId("");
      setAdoptionStatus("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create foster story",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <WebTemplate
        header="Write Foster Story"
        main={
          <div className="px-4 py-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <Input
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  labelClassName="text-subtitle font-semibold"
                  required
                />

                <div className="flex flex-col gap-1">
                  <label className="text-subtitle font-semibold">Story</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Story"
                    rows={6}
                    className="resize-none rounded-[10px] border border-primary bg-white px-3 py-2 outline-none"
                    required
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => setOpenPetModal(true)}
                  className="bg-primary px-3 py-2 text-lg"
                >
                  Link Pet Profile
                </Button>

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
                    disabled={loading}
                    className="w-full max-w-40 flex justify-center hover:scale-105 "
                  >
                    {loading ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        }
      />

      <LinkPetModal
        open={openPetModal}
        pets={modalPets}
        onClose={() => setOpenPetModal(false)}
        onSelect={(pet) => {
          setPetId(pet.id);
          setOpenPetModal(false);
        }}
      />
    </>
  );
}
