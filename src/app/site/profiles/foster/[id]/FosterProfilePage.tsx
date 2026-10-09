"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PawPrint } from "@phosphor-icons/react";
import WebTemplate from "@/src/components/template/WebTemplate";
import { LinkButton } from "@/src/components/ui/Button";
import Avatar from "@/src/components/ui/Avatar";
import LikeButton from "@/src/components/ui/LikeButton";
import SexIcon from "@/src/components/ui/SexIcon";
import type { PetGender } from "@/src/lib/types/shelters";

type FosterProfileProps = {
  petId: string;
  name: string;
  sex: PetGender;
  photo_url: string;
  /** The pet's other photos; the main photo is left out if it's among them. */
  photos?: string[];
  title: string;
  description: string;
  createdAt?: string | null;
  shelter: { id: string; name: string; logo_url?: string | null; location?: string | null } | null;
};

const MORE_PHOTOS = 4;

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/** A foster story read like a short article, ending with the pet you can meet. */
export default function FosterProfilePage({
  petId,
  name,
  sex,
  photo_url,
  photos = [],
  title,
  description,
  createdAt,
  shelter,
}: FosterProfileProps) {
  const paragraphs = description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const [lead, ...rest] = paragraphs;
  const morePhotos = photos.filter((url) => url !== photo_url).slice(0, MORE_PHOTOS);
  const date = formatDate(createdAt);
  const petHref = `/site/profiles/pets/${petId}`;

  return (
    <WebTemplate
      main={
        <article className="mx-auto flex w-full max-w-3xl flex-col pb-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sunshine-soft sm:aspect-[16/10]">
            {photo_url ? (
              <Image
                src={photo_url}
                alt={name}
                fill
                priority
                sizes="(min-width: 1024px) 768px, 100vw"
                className="object-cover object-[50%_30%]"
              />
            ) : (
              <PawPrint weight="fill" className="absolute inset-0 m-auto size-1/4 text-sunshine" aria-hidden="true" />
            )}
          </div>

          <header className="flex flex-col gap-4 pt-6 sm:pt-8">
            <h1 className="text-[clamp(1.625rem,1.6vw+1rem,2.25rem)] leading-[1.12] font-extrabold tracking-[-0.02em] text-balance text-ink">
              {title || `${name}'s story`}
            </h1>
            {shelter ? (
              <div className="flex items-center gap-3">
                <Avatar src={shelter.logo_url} name={shelter.name} size={40} />
                <div className="flex min-w-0 flex-col">
                  <p className="text-sm text-ink">
                    A foster story from{" "}
                    <Link
                      href={`/site/profiles/shelter/${shelter.id}`}
                      className="font-semibold underline decoration-sunshine-deep decoration-2 underline-offset-4 hover:decoration-ink"
                    >
                      {shelter.name}
                    </Link>
                  </p>
                  <p className="truncate text-xs text-muted">
                    {[shelter.location, date].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            ) : date ? (
              <p className="text-xs text-muted">{date}</p>
            ) : null}
          </header>

          <div className="flex max-w-[65ch] flex-col gap-5 border-t border-line pt-6 mt-6 sm:pt-8 sm:mt-8">
            {lead ? (
              <>
                <p className="text-lg leading-relaxed break-words whitespace-pre-line text-ink">{lead}</p>
                {rest.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed break-words whitespace-pre-line text-ink-soft">
                    {p}
                  </p>
                ))}
              </>
            ) : (
              <p className="text-ink-soft">The shelter hasn&apos;t written this story yet.</p>
            )}
          </div>

          {morePhotos.length > 0 ? (
            <section aria-labelledby="more-photos" className="flex flex-col gap-3 pt-10">
              <h2 id="more-photos" className="text-xl font-semibold text-ink">
                More of {name}
              </h2>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {morePhotos.map((url) => (
                  <li key={url} className="relative aspect-square overflow-hidden rounded-md bg-sunshine-soft">
                    <Image src={url} alt="" fill sizes="(min-width: 640px) 190px, 45vw" className="object-cover" />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {petId ? (
            <aside
              aria-label={`Meet ${name}`}
              className="mt-10 flex flex-col gap-4 rounded-xl bg-sunshine p-3 sm:flex-row sm:items-center sm:p-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-sunshine-soft sm:size-24">
                  {photo_url ? (
                    <Image src={photo_url} alt="" fill sizes="96px" className="object-cover" />
                  ) : (
                    <PawPrint weight="fill" className="absolute inset-0 m-auto size-1/2 text-sunshine" aria-hidden="true" />
                  )}
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="flex items-center gap-2 text-2xl leading-tight font-extrabold text-ink">
                    <span className="truncate">Meet {name}</span>
                    {sex === "male" || sex === "female" ? (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-card">
                        <SexIcon sex={sex} size={16} />
                      </span>
                    ) : null}
                  </p>
                  <p className="text-sm text-ink">
                    {shelter ? `At ${shelter.name}` : "Looking for a home"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LikeButton targetType="pet" targetId={petId} variant="outlined" />
                <LinkButton href={petHref} variant="secondary" size="lg" className="flex-1 border-transparent sm:flex-none">
                  View profile
                  <ArrowRight aria-hidden="true" />
                </LinkButton>
              </div>
            </aside>
          ) : null}
        </article>
      }
    />
  );
}
