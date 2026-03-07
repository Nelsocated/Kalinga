import Link from "next/link";
import { ExplorePet } from "@/components/explore/types";
import LikeButton from "@/components/ui/LikeButton";
import { getFeed } from "@/lib/services/feed";

const STORY_BADGES = [
  "Miracle Cancer Survivor",
  "Second Chance Journey",
  "From Rescue to Recovery",
  "Gentle Soul in Foster",
];

const STORY_TITLES = [
  "Miracle Cancer Survivor",
  "Rescued and Recovering",
  "Healing with Foster Care",
  "Ready for a Forever Home",
];

const FALLBACK_STORIES: ExplorePet[] = [
  {
    id: "fallback-foster-1",
    name: "Nelson",
    shelter: { shelter_name: "Ilonggo Puspins" },
    pet_media: [
      {
        type: "photo",
        url: "",
        caption: "Nelson is recovering well in foster care and is learning to trust people again.",
      },
    ],
  },
  {
    id: "fallback-foster-2",
    name: "Mochi",
    shelter: { shelter_name: "Happy Tails Rescue" },
    pet_media: [
      {
        type: "photo",
        url: "",
        caption: "Mochi is playful, gentle, and currently thriving in a stable foster routine.",
      },
    ],
  },
  {
    id: "fallback-foster-3",
    name: "Kopi",
    shelter: { shelter_name: "Paw Haven Iloilo" },
    pet_media: [
      {
        type: "photo",
        url: "",
        caption: "Kopi is gaining confidence in foster care and enjoys short play sessions with volunteers.",
      },
    ],
  },
  {
    id: "fallback-foster-4",
    name: "Bituin",
    shelter: { shelter_name: "Fur Friends Home" },
    pet_media: [
      {
        type: "photo",
        url: "",
        caption: "Bituin has adjusted well to a stable routine and continues to improve each week.",
      },
    ],
  },
  {
    id: "fallback-foster-5",
    name: "Luna",
    shelter: { shelter_name: "Ilonggo Puspins" },
    pet_media: [
      {
        type: "photo",
        url: "",
        caption: "Luna is affectionate, observant, and now comfortable around familiar foster staff.",
      },
    ],
  },
  {
    id: "fallback-foster-6",
    name: "Toby",
    shelter: { shelter_name: "Rescue Haven Iloilo" },
    pet_media: [
      {
        type: "photo",
        url: "",
        caption: "Toby responds well to enrichment activities and is steadily improving social behavior.",
      },
    ],
  },
  {
    id: "fallback-foster-7",
    name: "Maple",
    shelter: { shelter_name: "Paw Haven Iloilo" },
    pet_media: [
      {
        type: "photo",
        url: "",
        caption: "Maple is recovering nicely and now follows a calm daily feeding and rest routine.",
      },
    ],
  },
  {
    id: "fallback-foster-8",
    name: "Choco",
    shelter: { shelter_name: "Fur Friends Home" },
    pet_media: [
      {
        type: "photo",
        url: "",
        caption: "Choco has become more playful in foster and is ready to meet potential adopters soon.",
      },
    ],
  },
];

const getPhoto = (pet: ExplorePet) => {
  return pet.pet_media.find((media) => media.type === "photo" && Boolean(media.url))?.url;
};

const getStoryText = (pet: ExplorePet) => {
  const caption = pet.pet_media.find((media) => media.caption?.trim())?.caption;
  if (caption && caption.trim().length > 0) {
    return caption.trim();
  }

  return "Preview: This pet is steadily improving in foster care with consistent routines, socialization, and gentle support from caregivers.";
};

const pickById = (pet: ExplorePet, pool: string[]) => {
  const key = pet.id ?? pet.name ?? "pet";
  const hash = Array.from(key).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return pool[hash % pool.length];
};

export default async function FosterPage() {
  const feed = ((await getFeed(20)) ?? []) as ExplorePet[];
  const stories = feed.slice(0, 12);
  const storiesToRender = stories.length > 0 ? stories : FALLBACK_STORIES;

  return (
    <div className="min-h-[85vh] bg-[#fff4cf] p-6 md:p-10">
      <div className="mb-8 flex items-center gap-3">
        <h1 className="text-4xl font-bold text-black">Foster&apos;s story</h1>
        <Link href="/site/explore" aria-label="Back to explore" className="text-2xl font-bold text-black">
          &#8249;
        </Link>
      </div>

      <div className="flex max-w-5xl flex-col gap-6">
        {storiesToRender.map((pet) => {
          const photo = getPhoto(pet);
          const badge = `\"${pickById(pet, STORY_BADGES)}\"`;
          const title = `\"${pickById(pet, STORY_TITLES)}\"`;
          const storyText = getStoryText(pet);
          const petName = pet.name ?? "Nelson";
          const shelter = pet.shelter?.shelter_name ?? "Ilonggo Puspins";

          return (
            <article key={pet.id} className="flex items-stretch gap-4 rounded-2xl border border-[#e8bf42] bg-[#f6cf55] p-3">
              <div className="flex w-64 flex-col rounded-xl bg-[#f3be0f] p-3">
                <div className="relative">
                  <div className="absolute -top-5 left-1/2 z-10 min-w-55 -translate-x-1/2 rounded-full border-2 border-[#f3be0f] bg-white px-5 py-1 text-center text-xs font-semibold text-[#f3be0f] shadow">
                    {badge}
                  </div>

                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt={petName} className="h-48 w-full rounded-xl object-cover" />
                  ) : (
                    <div className="h-48 w-full rounded-xl bg-white" />
                  )}
                </div>

                <div className="mt-2">
                  <h3 className="text-lg font-bold text-black">{petName}</h3>
                  <p className="text-xs text-gray-700">{shelter}</p>
                </div>

                <Link
                  href={`/site/pet/${pet.id}`}
                  className="mt-auto self-end rounded-full border border-white bg-[#f3be0f] px-4 py-1 text-sm font-semibold text-white hover:bg-[#dfa90d]"
                >
                  more info
                </Link>
              </div>

              <div className="relative flex-1 rounded-xl border border-[#e8bf42] bg-[#efe7d6] p-6">
                <h2 className="mb-2 text-xl font-bold text-black">{title}</h2>

                <p className="pr-12 text-sm leading-relaxed text-gray-800">{storyText}</p>

                <div className="absolute top-3 right-3 flex flex-col items-center gap-3 text-yellow-600">
                  <LikeButton targetType="pet" targetId={pet.id} theme="foster" size={72} />
                  <Link href={`/site/foster/${pet.id}`} aria-label="Open detailed foster story" className="cursor-pointer text-[42px] leading-none">
                    &#8250;
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
