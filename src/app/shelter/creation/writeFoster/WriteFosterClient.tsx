"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Compass } from "@phosphor-icons/react";
import WebTemplate from "@/src/components/template/WebTemplate";
import LinkPetModal from "@/src/components/modal/LinkPetModal";
import LinkedPetField from "@/src/components/forms/LinkedPetField";
import AvailabilityField from "@/src/components/forms/AvailabilityField";
import Input from "@/src/components/ui/Input";
import Textarea from "@/src/components/ui/Textarea";
import Button, { LinkButton } from "@/src/components/ui/Button";
import type { PetCardProps } from "@/src/lib/types/shelters";
import { createFosterAction } from "@/src/app/actions/content";

type Props = {
  pets: PetCardProps[];
  initialError: string | null;
  initialPetId: string;
};

type Availability = "available" | "not_available" | "";
type FieldErrors = Partial<Record<"pet" | "title" | "story", string>>;

export default function WriteFosterClient({ pets, initialError, initialPetId }: Props) {
  const [petId, setPetId] = useState(initialPetId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adoptionStatus, setAdoptionStatus] = useState<Availability>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [publishedFor, setPublishedFor] = useState<string | null>(null);
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

    const errors: FieldErrors = {
      pet: petId ? undefined : "Choose which pet this story is about.",
      title: title.trim() ? undefined : "Add a title.",
      story: description.trim() ? undefined : "Write the story first.",
    };
    setFieldErrors(errors);
    if (errors.pet || errors.title || errors.story) return;

    setLoading(true);
    try {
      const result = await createFosterAction({
        petId,
        title: title.trim(),
        description: description.trim(),
        adoptionStatus,
      });
      if (!result.ok) throw new Error(result.error);

      setPublishedFor(selectedPet?.petName ?? "your pet");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't publish the story. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function startOver() {
    setTitle("");
    setDescription("");
    setPetId("");
    setAdoptionStatus("");
    setFieldErrors({});
    setPublishedFor(null);
  }

  if (publishedFor) {
    return (
      <WebTemplate
        header="Write a foster story"
        main={
          <div className="flex max-w-xl flex-col items-start gap-5 py-6">
            <span className="flex size-14 items-center justify-center rounded-full bg-approved/14 text-approved-text">
              <CheckCircle size={32} weight="fill" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-2" role="status">
              <h2 className="text-headline text-ink">{publishedFor}&apos;s story is published</h2>
              <p className="text-ink-soft">People find foster stories on Explore.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/site/explore" variant="primary" icon={<Compass aria-hidden="true" />}>
                See it on Explore
              </LinkButton>
              <Button variant="secondary" onClick={startOver}>
                Write another story
              </Button>
            </div>
          </div>
        }
      />
    );
  }

  return (
    <>
      <WebTemplate
        header="Write a foster story"
        main={
          <form onSubmit={handleSubmit} noValidate className="flex max-w-2xl flex-col gap-6">
            <LinkedPetField
              pet={selectedPet}
              onChoose={() => setOpenPetModal(true)}
              hasPets={pets.length > 0}
              error={fieldErrors.pet}
            />
            <Input
              label="Title"
              hint="For example: Mochi's first week on the couch"
              error={fieldErrors.title}
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              label="Story"
              hint="How is the pet doing in foster care? What are they like at home?"
              error={fieldErrors.story}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
            />
            <AvailabilityField value={adoptionStatus} onChange={setAdoptionStatus} />

            {error ? (
              <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
                {error}
              </p>
            ) : null}

            <Button type="submit" variant="primary" size="lg" loading={loading} disabled={!pets.length} className="w-full sm:w-fit">
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
          setFieldErrors((prev) => ({ ...prev, pet: undefined }));
          setOpenPetModal(false);
        }}
      />
    </>
  );
}
