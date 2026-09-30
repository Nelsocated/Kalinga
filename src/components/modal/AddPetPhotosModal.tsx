"use client";

import { useState } from "react";
import Image from "next/image";
import { Images, Plus } from "@phosphor-icons/react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { fetchJson } from "@/src/lib/fetchJson";

type Props = {
  petId: string;
  buttonClassName?: string;
};

type Photo = {
  id: string;
  url: string;
};

const MAX_PHOTOS = 5;

/** Shelter owners add up to five extra photos to a pet. */
export default function AddPetPhotosModal({ petId, buttonClassName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPhotos() {
    const json = await fetchJson<{ data: Photo[] }>(`/api/pets/photos?petId=${petId}`, { cache: "no-store" });
    setPhotos((json.data ?? []).filter((p) => p.url?.trim()));
  }

  async function open() {
    setIsOpen(true);
    setError(null);
    setFetching(true);
    try {
      await loadPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load photos.");
    } finally {
      setFetching(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (photos.length >= MAX_PHOTOS) {
      setError(`A pet can have up to ${MAX_PHOTOS} extra photos.`);
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("petId", petId);
      await fetchJson("/api/pets/photos", { method: "POST", body: form });
      await loadPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't upload that photo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={open} icon={<Images aria-hidden="true" />} className={buttonClassName}>
        Photos
      </Button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Pet photos">
        {fetching ? (
          <p role="status" className="text-sm text-muted">
            Loading photos…
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <ul className="grid grid-cols-3 gap-2">
              {photos.map((p) => (
                <li key={p.id} className="relative aspect-square overflow-hidden rounded-md bg-sunshine-soft">
                  <Image src={p.url} alt="" fill sizes="160px" className="object-cover" />
                </li>
              ))}
              {photos.length < MAX_PHOTOS ? (
                <li>
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-line text-sm font-medium text-ink transition-colors focus-within:ring-2 focus-within:ring-ink hover:bg-sunshine-wash">
                    <Plus size={22} aria-hidden="true" />
                    {uploading ? "Uploading…" : "Add photo"}
                    <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={handleFileChange} />
                  </label>
                </li>
              ) : null}
            </ul>
            <p className="text-sm text-muted">
              {photos.length} of {MAX_PHOTOS} photos
            </p>
            {error ? (
              <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
                {error}
              </p>
            ) : null}
          </div>
        )}
      </Modal>
    </>
  );
}
