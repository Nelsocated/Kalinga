"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Media = {
  id: string;
  type: "photo" | "video";
  url: string;
  caption: string | null;
};

type Props = {
  name: string;
  photo_url: string;
  pet_media?: Media[];
};

export default function PhotoView({ name, photo_url, pet_media = [] }: Props) {
  const [start, setStart] = useState(0);
  const [selectedUrl, setSelectedUrl] = useState(photo_url);

  const extraPhotos = useMemo(() => {
    return pet_media
      .filter(
        (item) => item.type === "photo" && item.url && item.url !== photo_url,
      )
      .slice(0, 5);
  }, [pet_media, photo_url]);

  const allPhotos = useMemo(() => {
    const mainPhoto = photo_url
      ? [
          {
            id: "main-photo",
            type: "photo" as const,
            url: photo_url,
            caption: `${name} main photo`,
          },
        ]
      : [];

    return [...mainPhoto, ...extraPhotos];
  }, [photo_url, extraPhotos, name]);

  useEffect(() => {
    setSelectedUrl(photo_url);
  }, [photo_url]);

  const canSlide = extraPhotos.length > 3;

  const visibleExtras = useMemo(() => {
    if (extraPhotos.length <= 3) {
      return extraPhotos;
    }

    return [0, 1, 2].map(
      (offset) => extraPhotos[(start + offset) % extraPhotos.length],
    );
  }, [extraPhotos, start]);

  const next = () => {
    if (!canSlide) return;
    setStart((prev) => (prev + 1) % extraPhotos.length);
  };

  const prev = () => {
    if (!canSlide) return;
    setStart((prev) => (prev - 1 + extraPhotos.length) % extraPhotos.length);
  };

  const selectedPhoto =
    allPhotos.find((photo) => photo.url === selectedUrl) ?? allPhotos[0];

  return (
    <div>
      <div className="mb-4 overflow-hidden rounded-[15px] bg-black/5">
        {selectedPhoto?.url ? (
          <Image
            src={selectedPhoto.url}
            alt={selectedPhoto.caption ?? `${name} photo`}
            className="h-60 w-full object-cover"
          />
        ) : (
          <div className="flex h-60 items-center justify-center text-description opacity-70">
            No main photo yet.
          </div>
        )}
      </div>

      {extraPhotos.length > 0 ? (
        <div className="relative w-full">
          <div className="grid grid-cols-3 gap-3">
            {visibleExtras.map((photo) => {
              const isActive = selectedUrl === photo.url;

              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelectedUrl(photo.url)}
                  className={[
                    "overflow-hidden rounded-xl transition",
                    isActive
                      ? "ring-3 ring-primary"
                      : "opacity-90 hover:opacity-100",
                  ].join(" ")}
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption ?? "Pet photo"}
                    className="aspect-3/4 w-full object-cover shadow-sm"
                  />
                </button>
              );
            })}
          </div>

          {canSlide && (
            <button
              type="button"
              onClick={prev}
              className="absolute top-1/2 -left-6 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-black/5 hover:shadow-lg"
            >
              ‹
            </button>
          )}

          {canSlide && (
            <button
              type="button"
              onClick={next}
              className="absolute top-1/2 -right-6 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-black/5 hover:shadow-lg"
            >
              ›
            </button>
          )}
        </div>
      ) : (
        <div className="text-sm opacity-70">No extra photos yet.</div>
      )}
    </div>
  );
}
