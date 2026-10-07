"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

import Input from "@/src/components/ui/Input";
import WebTemplate from "@/src/components/template/WebTemplate";
import Button, { LinkButton } from "@/src/components/ui/Button";
import FilterControls from "@/src/components/ui/FilterControls";
import Textarea from "@/src/components/ui/Textarea";
import { Camera, CheckCircle, VideoCamera } from "@phosphor-icons/react";
import { cn } from "@/src/lib/cn";
import { createClientSupabase } from "@/src/lib/supabase/client";
import { createPetAction } from "@/src/app/actions/content";

type Species = "dog" | "cat";
type Sex = "male" | "female";
type AgeUi = "kitten/puppy" | "young_adult" | "adult" | "senior";
type Size = "small" | "medium" | "large";

type FormState = {
  name: string;
  breed: string;
  description: string;
  species: Species;
  sex: Sex;
  age: AgeUi;
  size: Size;
  vaccinated: boolean;
  spayed_neutered: boolean;
  year_inShelter: string;
};

type FieldErrors = Partial<Record<"photo" | "name" | "breed" | "year_inShelter" | "description", string>>;

const INITIAL_FORM: FormState = {
  name: "",
  breed: "",
  description: "",
  species: "dog",
  sex: "male",
  age: "kitten/puppy",
  size: "small",
  vaccinated: false,
  spayed_neutered: false,
  year_inShelter: "",
};

function validate(form: FormState): FieldErrors {
  const year = Number(form.year_inShelter.trim());
  const thisYear = new Date().getFullYear();

  return {
    name: form.name.trim() ? undefined : "Add the pet's name.",
    breed: form.breed.trim() ? undefined : "Add the breed, or Mixed if you're not sure.",
    year_inShelter: !form.year_inShelter.trim()
      ? "Add the year the pet arrived."
      : !Number.isInteger(year) || year < 1980
        ? "Use a four-digit year, for example 2021."
        : year > thisYear
          ? "The year can't be in the future."
          : undefined,
    description: form.description.trim() ? undefined : "Write a little about this pet.",
  };
}

export default function Page() {
  const supabase = useMemo(() => createClientSupabase(), []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [created, setCreated] = useState<{ id: string; name: string } | null>(null);

  // Free the local preview when it's replaced or the page closes
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (key in fieldErrors) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({ ...prev, photo: "That isn't an image. Choose a JPG or PNG." }));
      return;
    }

    const maxSizeMb = 5;
    if (file.size > maxSizeMb * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, photo: `That photo is over ${maxSizeMb} MB. Choose a smaller one.` }));
      return;
    }

    setFieldErrors((prev) => ({ ...prev, photo: undefined }));
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function uploadPhoto(): Promise<string | null> {
    if (!selectedFile) return null;

    setUploadingImage(true);

    try {
      const fileExt = selectedFile.name.split(".").pop() || "jpg";
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `pets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("pet_photos")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload image.");
      }
      const { data } = supabase.storage
        .from("pet_photos")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const errors = validate(form);
    setFieldErrors(errors);
    const firstInvalid = (["name", "breed", "year_inShelter", "description"] as const).find((key) => errors[key]);
    if (firstInvalid) {
      document.getElementById(`pet-${firstInvalid}`)?.focus();
      return;
    }

    setSubmitting(true);

    try {
      const photoUrl = await uploadPhoto();

      const result = await createPetAction({
        name: form.name.trim(),
        breed: form.breed.trim() || null,
        description: form.description.trim() || null,
        species: form.species,
        sex: form.sex,
        age: form.age,
        size: form.size,
        vaccinated: form.vaccinated,
        spayed_neutered: form.spayed_neutered,
        photo_url: photoUrl,
        year_inShelter: form.year_inShelter,
      });

      if (!result.ok) throw new Error(result.error);

      setCreated({ id: result.data.id, name: form.name.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create pet.");
    } finally {
      setSubmitting(false);
    }
  }

  function startOver() {
    setCreated(null);
    setForm(INITIAL_FORM);
    setSelectedFile(null);
    setPreviewUrl("");
    setFieldErrors({});
  }

  if (created) {
    return (
      <WebTemplate
        header="Add a pet"
        main={
          <div className="flex max-w-xl flex-col items-start gap-5 py-6">
            <span className="flex size-14 items-center justify-center rounded-full bg-approved/14 text-approved-text">
              <CheckCircle size={32} weight="fill" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-2" role="status">
              <h2 className="text-headline text-ink">{created.name} is on Kalinga</h2>
              <p className="text-ink-soft">
                Their profile is up. A short video puts them in the For You feed, where most people find pets.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton
                href={`/shelter/creation/postVideo?pet=${created.id}`}
                variant="primary"
                icon={<VideoCamera weight="fill" aria-hidden="true" />}
              >
                Post a video of {created.name}
              </LinkButton>
              <LinkButton href={`/site/profiles/pets/${created.id}`} variant="secondary">
                View profile
              </LinkButton>
              <Button variant="ghost" onClick={startOver}>
                Add another pet
              </Button>
            </div>
          </div>
        }
      />
    );
  }

  return (
    <WebTemplate
      header="Add a pet"
      main={
        <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="flex flex-col gap-2 lg:sticky lg:top-6 lg:self-start">
            <span className="text-sm font-medium text-ink">Main photo</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-describedby={fieldErrors.photo ? "photo-error" : undefined}
              className={cn(
                "relative flex aspect-4/5 w-full max-w-80 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed bg-card text-center transition-colors hover:bg-sunshine-wash",
                fieldErrors.photo ? "border-reject" : "border-line",
              )}
            >
              {previewUrl ? (
                <Image src={previewUrl} alt="Preview of the pet photo" fill className="object-cover" unoptimized />
              ) : (
                <>
                  <Camera size={28} className="text-ink" aria-hidden="true" />
                  <span className="text-sm font-semibold text-ink">Choose a photo</span>
                  <span className="px-4 text-xs text-muted">A clear face shot works best. JPG or PNG, up to 5 MB.</span>
                </>
              )}
            </button>
            {fieldErrors.photo ? (
              <p id="photo-error" className="text-xs font-medium text-reject-text">
                {fieldErrors.photo}
              </p>
            ) : null}
            {previewUrl ? (
              <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="w-fit">
                Change photo
              </Button>
            ) : null}
            <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={handleFileChange} />
          </div>

          <div className="flex flex-col gap-10">
            <section aria-labelledby="pet-basics" className="flex flex-col gap-5">
              <h2 id="pet-basics" className="text-xl font-semibold text-ink">
                Basics
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="pet-name"
                  label="Name"
                  required
                  maxLength={60}
                  error={fieldErrors.name}
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
                <Input
                  id="pet-breed"
                  label="Breed"
                  required
                  maxLength={60}
                  error={fieldErrors.breed}
                  value={form.breed}
                  onChange={(e) => updateField("breed", e.target.value)}
                />
              </div>
              <Input
                id="pet-year_inShelter"
                label="Year the pet arrived"
                hint="For example 2021. We show how long they've waited."
                required
                inputMode="numeric"
                maxLength={4}
                className="sm:max-w-60"
                inputClassName="tabular-nums"
                error={fieldErrors.year_inShelter}
                value={form.year_inShelter}
                onChange={(e) => updateField("year_inShelter", e.target.value)}
              />
              <Textarea
                id="pet-description"
                label="About this pet"
                hint="Personality, habits, who they get along with."
                required
                error={fieldErrors.description}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={5}
              />
            </section>

            <section aria-labelledby="pet-details" className="flex flex-col gap-6 border-t border-line pt-8">
              <h2 id="pet-details" className="text-xl font-semibold text-ink">
                Details
              </h2>
              <FilterControls.SpeciesSection selected={[form.species]} onToggle={(value) => updateField("species", value)} />
              <FilterControls.GenderSection selected={[form.sex]} onToggle={(value) => updateField("sex", value)} />
              <FilterControls.AgeSection selected={[form.age]} onToggle={(value) => updateField("age", value)} />
              <FilterControls.SizeSection selected={[form.size]} onToggle={(value) => updateField("size", value)} />
              <fieldset className="flex flex-col gap-2.5">
                <legend className="mb-2.5 text-sm font-semibold text-ink">Health</legend>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["vaccinated", "Vaccinated"],
                      ["spayed_neutered", "Spayed or neutered"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={form[key]}
                      onClick={() => updateField(key, !form[key])}
                      className={cn(
                        "flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                        form[key] ? "border-sunshine bg-sunshine text-ink" : "border-line bg-card text-ink hover:bg-sunshine-wash",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </section>

            <div className="flex flex-col gap-4 border-t border-line pt-8">
              {error ? (
                <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
                  {error}
                </p>
              ) : null}
              <Button type="submit" variant="primary" size="lg" loading={submitting || uploadingImage} className="w-full sm:w-fit">
                {uploadingImage ? "Uploading photo" : "Add pet"}
              </Button>
            </div>
          </div>
        </form>
      }
    />
  );
}
