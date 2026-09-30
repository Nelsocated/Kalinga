"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import WebTemplate from "@/src/components/template/WebTemplate";
import LinkPetModal from "@/src/components/modal/LinkPetModal";
import LinkedPetField from "@/src/components/forms/LinkedPetField";
import AvailabilityField from "@/src/components/forms/AvailabilityField";
import Input from "@/src/components/ui/Input";
import Textarea from "@/src/components/ui/Textarea";
import Button from "@/src/components/ui/Button";
import type { PetCardProps } from "@/src/lib/types/shelters";
import { createFosterAction } from "@/src/app/actions/content";

type Props = {
  pets: PetCardProps[];
  initialError: string | null;
};

type Availability = "available" | "not_available" | "";

export default function WriteFosterClient({ pets, initialError }: Props) {
  const [petId, setPetId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adoptionStatus, setAdoptionStatus] = useState<Availability>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [published, setPublished] = useState(false);
  const [openPetModal, setOpenPetModal] = useState(false);

  const selectedPet = useMemo(() => pets.find((pet) => pet.id === petId) ?? null, [pets, petId]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPublished(false);

    if (!petId) return setError("Choose which pet this story is about.");
    if (!title.trim()) return setError("Add a title.");
    if (!description.trim()) return setError("Write the story first.");

    setLoading(true);
    try {
      const result = await createFosterAction({
        petId,
        title: title.trim(),
        description: description.trim(),
        adoptionStatus,
      });
      if (!result.ok) throw new Error(result.error);

      setTitle("");
      setDescription("");
      setPetId("");
      setAdoptionStatus("");
      setPublished(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't publish the story. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <WebTemplate
        header="Write a foster story"
        main={
          <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
            <LinkedPetField pet={selectedPet} onChoose={() => setOpenPetModal(true)} />
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea
              label="Story"
              hint="How is the pet doing in foster care? What are they like at home?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              required
            />
            <AvailabilityField value={adoptionStatus} onChange={setAdoptionStatus} />

            {error ? (
              <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
                {error}
              </p>
            ) : null}
            {published ? (
              <p role="status" className="rounded-md bg-approved/14 px-3 py-2 text-sm text-approved-text">
                Story published.{" "}
                <Link href="/site/explore" className="font-semibold underline underline-offset-4">
                  See it on Explore
                </Link>
              </p>
            ) : null}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full sm:w-fit">
              Publish story
            </Button>
          </form>
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
