"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/src/components/ui/Input";
import WebTemplate from "@/src/components/template/WebTemplate";
import Button from "@/src/components/ui/Button";
import FilterControls from "@/src/components/ui/FilterControls";
import Textarea from "@/src/components/ui/Textarea";
import { Camera } from "@phosphor-icons/react";
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

export default function Page() {
  const router = useRouter();
  const supabase = useMemo(() => createClientSupabase(), []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>({
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
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      e.target.value = "";
      return;
    }

    const maxSizeMb = 5;
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Image must be ${maxSizeMb}MB or smaller.`);
      e.target.value = "";
      return;
    }

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

    if (!form.name.trim()) {
      setError("Add the pet's name.");
      return;
    }
    if (!form.year_inShelter.trim()) {
      setError("Add the year the pet arrived.");
      return;
    }
    if (!form.description.trim()) {
      setError("Write a little about this pet.");
      return;
    }
    if (!form.breed.trim()) {
      setError("Add the breed.");
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

      router.push("/shelter/profiles/shelter");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create pet.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <WebTemplate
      header="Add a pet"
      main={
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">Main photo</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed border-line bg-card text-center transition-colors hover:bg-sunshine-wash"
            >
              {previewUrl ? (
                <Image src={previewUrl} alt="Preview of the pet photo" fill className="object-cover" unoptimized />
              ) : (
                <>
                  <Camera size={28} className="text-ink" aria-hidden="true" />
                  <span className="text-sm font-medium text-ink">Choose a photo</span>
                  <span className="text-xs text-muted">JPG or PNG, up to 5 MB</span>
                </>
              )}
            </button>
            {previewUrl ? (
              <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="w-fit">
                Change photo
              </Button>
            ) : null}
            <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={handleFileChange} />
          </div>

          <div className="flex flex-col gap-5">
            <Input label="Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
            <Input label="Breed" value={form.breed} onChange={(e) => updateField("breed", e.target.value)} required />
            <Input
              label="Year the pet arrived"
              hint="For example 2021. We show how long they've waited."
              inputMode="numeric"
              value={form.year_inShelter}
              onChange={(e) => updateField("year_inShelter", e.target.value)}
              required
            />
            <Textarea
              label="About this pet"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={5}
              required
            />

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
                    className={[
                      "flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                      form[key] ? "border-sunshine bg-sunshine text-ink" : "border-line bg-card text-ink hover:bg-sunshine-wash",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            {error ? (
              <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
                {error}
              </p>
            ) : null}

            <Button type="submit" variant="primary" size="lg" loading={submitting || uploadingImage} className="w-full sm:w-fit">
              Add pet
            </Button>
          </div>
        </form>
      }
    />
  );
}
