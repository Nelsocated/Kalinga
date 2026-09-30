"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PawPrint } from "@phosphor-icons/react";
import { cn } from "@/src/lib/cn";

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

/** Main photo with a row of thumbnails to switch between. */
export default function PhotoView({ name, photo_url, pet_media = [] }: Props) {
  const photos = useMemo(() => {
    const extras = pet_media
      .filter((item) => item.type === "photo" && item.url && item.url !== photo_url)
      .slice(0, 5)
      .map((item) => ({ id: item.id, url: item.url }));
    return photo_url ? [{ id: "main-photo", url: photo_url }, ...extras] : extras;
  }, [pet_media, photo_url]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = photos.find((p) => p.id === selectedId) ?? photos[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-sunshine-soft">
        {selected ? (
          <Image
            key={selected.url}
            src={selected.url}
            alt={`${name}`}
            fill
            priority
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-ink-soft">
            <PawPrint size={40} aria-hidden="true" />
            <span className="text-sm">No photos yet</span>
          </div>
        )}
      </div>

      {photos.length > 1 ? (
        <div className="flex snap-x gap-2 overflow-x-auto p-1 [scrollbar-width:none]" role="list" aria-label={`Photos of ${name}`}>
          {photos.map((photo, i) => {
            const active = photo.id === selected?.id;
            return (
              <button
                key={photo.id}
                type="button"
                role="listitem"
                onClick={() => setSelectedId(photo.id)}
                aria-label={`Show photo ${i + 1} of ${photos.length}`}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "relative size-16 shrink-0 snap-start overflow-hidden rounded-md transition-opacity sm:size-20",
                  active ? "ring-2 ring-ink ring-offset-2 ring-offset-ground" : "opacity-80 hover:opacity-100",
                )}
              >
                <Image src={photo.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
