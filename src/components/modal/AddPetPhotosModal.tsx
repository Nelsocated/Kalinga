"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import BackButton from "../ui/BackButton";
import Plus from "@/public/icons/Plus.svg";

type Props = {
  petId: string;
  buttonClassName?: string;
};

type Photo = {
  id: string;
  url: string;
};

export default function AddPetPhotosModal({ petId, buttonClassName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // reset on close
  useEffect(() => {
    if (!isOpen) {
      setError(null);
    }
  }, [isOpen]);

  // fetch photos on open
  useEffect(() => {
    if (!isOpen) return;

    async function loadPhotos() {
      setFetching(true);

      try {
        const res = await fetch(`/api/pets/photos?petId=${petId}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json?.error || "Failed to load photos");

        setPhotos(json.photos ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading photos");
      } finally {
        setFetching(false);
      }
    }

    loadPhotos();
  }, [isOpen, petId]);

  // upload (Promise style like your request)
  function uploadPhoto(file: File): Promise<string> {
    return fetch("/api/pets/photos", {
      method: "POST",
      body: (() => {
        const form = new FormData();
        form.append("file", file);
        form.append("petId", petId);
        return form;
      })(),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      return data.url;
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (photos.length >= 5) {
      alert("Max 5 photos allowed");
      return;
    }

    setLoading(true);

    try {
      await uploadPhoto(file);

      setLoading(true);
      const res = await fetch(`/api/pets/photos?petId=${petId}`);
      const json = await res.json();

      setPhotos(json.photos ?? []);
      setLoading(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={[
          "flex flex-col items-center bg-primary rounded-full font-semibold hover:scale-105",
          buttonClassName,
        ].join(" ")}
      >
        <Image src={Plus} alt="plus-icon" width={40} height={40} />
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* MODAL BOX */}
          <div className="relative z-10 w-125 rounded-[15px] bg-innerbg shadow-2xl">
            {/* HEADER (same pattern as DonationModal) */}
            <div className="grid grid-cols-3 items-center bg-primary py-3 rounded-t-[15px]">
              <div className="pl-4">
                <BackButton onClick={() => setIsOpen(false)} />
              </div>

              <div className="text-center text-title font-bold text-innerbg">
                Pet Photos
              </div>

              <div />
            </div>

            {/* BODY */}
            <div className="max-h-[75vh] overflow-y-auto px-10 py-4 space-y-3">
              {error && <div className="text-sm text-red-600">{error}</div>}

              {fetching ? (
                <div className="text-sm opacity-60">Loading...</div>
              ) : (
                <>
                  {/* GRID */}
                  <div className="grid grid-cols-3 gap-2">
                    {photos
                      .filter(
                        (p) => typeof p.url === "string" && p.url.trim() !== "",
                      )
                      .map((p) => (
                        <Image
                          key={p.id}
                          src={p.url}
                          alt="pet photo"
                          width={200}
                          height={200}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                      ))}

                    {/* ADD BUTTON */}
                    {photos.length < 5 && (
                      <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-sm hover:bg-gray-100">
                        {loading ? "..." : "+ Add"}

                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="text-sm text-gray-500">
                    {photos.length}/5 photos uploaded
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
