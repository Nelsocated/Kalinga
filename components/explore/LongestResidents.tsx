"use client";

import { useRouter } from "next/navigation";
import { ExplorePet } from "@/components/explore/types";

type LongestResidentsProps = {
  items: ExplorePet[];
  showAdoptionPosts: boolean;
  onToggleAdoptionPosts: () => void;
};

export default function LongestResidents({
  items,
  showAdoptionPosts,
  onToggleAdoptionPosts,
}: LongestResidentsProps) {
  const router = useRouter();
  const featuredResidents = items.slice(0, 4);

  const openResidentProfile = (id: string) => {
    router.push(`/site/pet/${id}`);
  };

  return (
    <div className="mb-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-black">Our longest residents</h2>
        <button
          type="button"
          onClick={onToggleAdoptionPosts}
          aria-label={showAdoptionPosts ? "Back to longest residents" : "Show pet adoption posts"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8bf42] bg-white text-xl font-bold text-black"
        >
          {showAdoptionPosts ? "<" : ">"}
        </button>
      </div>

      {showAdoptionPosts ? (
        <div className="grid max-h-[60vh] grid-cols-1 gap-4 overflow-y-auto pr-2 md:grid-cols-2 xl:grid-cols-3">
          {items.map((resident) => {
            const firstPhoto = resident.pet_media.find((media) => media.type === "photo");
            const shelter = resident.shelter?.shelter_name ?? "Available for adoption";
            const caption = resident.pet_media.find((media) => media.caption?.trim())?.caption;

            return (
              <article
                key={resident.id}
                className="aspect-square rounded-2xl border border-[#e8bf42] bg-[#f6cf55] p-4"
              >
                <div className="flex h-full flex-col gap-3">
                  {firstPhoto ? (
                    <img
                      src={firstPhoto.url}
                      alt={resident.name ?? "Resident pet"}
                      className="h-1/2 w-full rounded-xl bg-white object-cover"
                    />
                  ) : (
                    <div className="h-1/2 w-full rounded-xl bg-white" />
                  )}
                  <div className="flex flex-1 flex-col">
                    <div className="flex w-full items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <h3 className="text-xl font-bold text-black">{resident.name ?? "Unnamed"}</h3>
                        <p className="mt-1 text-sm text-black/70">{shelter}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openResidentProfile(resident.id)}
                        className="rounded-full border border-white bg-[#f3be0f] px-4 py-1 text-sm font-semibold text-white hover:bg-[#dfa90d]"
                      >
                        More Info
                      </button>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm text-black/80">
                      {caption ?? "Looking for a loving home. Open for adoption inquiries."}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredResidents.map((resident) => {
            const firstPhoto = resident.pet_media.find((media) => media.type === "photo");
            const fallbackSubtitle = resident.shelter?.shelter_name ?? "Available for adoption";

            return (
              <article
                key={resident.id}
                className="rounded-2xl border border-[#e8bf42] bg-[#f6cf55] p-3"
              >
                {firstPhoto ? (
                  <img
                    src={firstPhoto.url}
                    alt={resident.name ?? "Resident pet"}
                    className="h-40 w-full rounded-xl bg-white object-cover"
                  />
                ) : (
                  <div className="h-40 rounded-xl bg-white" />
                )}
                <div className="mt-3 flex w-full items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-bold text-black">{resident.name ?? "Unnamed"}</h3>
                    <p className="mt-1 text-sm text-black/70">{fallbackSubtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openResidentProfile(resident.id)}
                    className="rounded-full border border-white bg-[#f3be0f] px-4 py-1 text-sm font-semibold text-white hover:bg-[#dfa90d]"
                  >
                    More Info
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

    </div>
  );
}