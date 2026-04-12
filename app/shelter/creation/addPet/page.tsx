"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/ui/Input";
import WebTemplate from "@/components/template/WebTemplate";
import Button from "@/components/ui/Button";
import FilterControls from "@/components/ui/FilterControls";
import { createClientSupabase } from "@/lib/supabase/client";

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
      setError("Pet name is required.");
      return;
    }
    if (!form.year_inShelter.trim()) {
      setError("Year/s in Shelter is required.");
      return;
    }
    if (!form.description.trim()) {
      setError("Information is required.");
      return;
    }
    if (!form.breed.trim()) {
      setError("Breed is required.");
      return;
    }

    setSubmitting(true);

    try {
      const photoUrl = await uploadPhoto();

      const res = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.error || "Failed to create pet.");
      }

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
      header={"Add a Pet"}
      main={
        <div className="px-4 py-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex h-50 w-80 overflow-hidden flex-col items-center justify-center rounded-[15px] border bg-white px-3 py-4 text-center transition hover:bg-primary/10"
                >
                  {previewUrl ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <Image
                        src={previewUrl}
                        alt="Pet preview"
                        width={140}
                        height={140}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <>
                      <span className="text-subtitle leading-none">+</span>
                      <span className="text-sm font-semibold">
                        Upload Pictures
                      </span>
                    </>
                  )}
                </button>

                <div className="relative h-50 w-80 overflow-hidden rounded-[15px] bg-primary">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Uploaded pet image"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Input
                  label="Pet Name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Pet Name"
                  labelClassName="text-subtitle font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <Input
                  label="Breed"
                  value={form.breed}
                  onChange={(e) => updateField("breed", e.target.value)}
                  placeholder="Breed"
                  labelClassName="text-subtitle font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <Input
                  label="Year in Shelter"
                  value={form.year_inShelter}
                  onChange={(e) =>
                    updateField("year_inShelter", e.target.value)
                  }
                  placeholder="Year in Shelter"
                  labelClassName="text-subtitle font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="description"
                  className="leading-7 text-subtitle font-semibold"
                >
                  Information
                </label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Information"
                  rows={5}
                  className="resize-none rounded-[15px] border border-primary bg-white px-3 py-2 outline-none"
                  required
                />
              </div>
              <div className="text-subtitle font-semibold">
                Characteristics:
              </div>

              <FilterControls.SpeciesSection
                selected={[form.species]}
                onToggle={(value) => updateField("species", value)}
              />

              <FilterControls.GenderSection
                selected={[form.sex]}
                onToggle={(value) => updateField("sex", value)}
              />

              <FilterControls.AgeSection
                selected={[form.age]}
                onToggle={(value) => updateField("age", value)}
              />

              <FilterControls.SizeSection
                selected={[form.size]}
                onToggle={(value) => updateField("size", value)}
              />

              <div>
                <div className="mb-2 text-subtitle font-semibold">Medical</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateField("vaccinated", !form.vaccinated)}
                    className={[
                      "rounded-[15px] border px-3 py-2 text-sm font-medium transition",
                      form.vaccinated
                        ? "bg-primary text-black"
                        : "border-black/50 bg-white text-black hover:bg-primary/10",
                    ].join(" ")}
                  >
                    Vaccinated
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateField("spayed_neutered", !form.spayed_neutered)
                    }
                    className={[
                      "rounded-[15px] border px-3 py-2 text-sm font-medium transition",
                      form.spayed_neutered
                        ? "bg-primary text-black"
                        : "border-black/50 bg-white text-black hover:bg-primary/10",
                    ].join(" ")}
                  >
                    Spayed / Neutered
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-[10px] bg-red-100 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="w-full max-w-100"
                >
                  {submitting || uploadingImage ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      }
    />
  );
}
