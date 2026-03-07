import Link from "next/link";
import { ExplorePet } from "@/components/explore/types";
import LikeButton from "@/components/ui/LikeButton";
import { getFeed } from "@/lib/services/feed";
import FosterAdoptButton from "./FosterAdoptButton";

const CHARACTERISTIC_POOL = [
  "Vaccinated",
  "Neutered",
  "Friendly",
  "Playful",
  "Healthy",
  "Adoptable",
  "Litter Trained",
  "Leash Trained",
  "Kid Friendly",
  "Indoor Ready",
  "Social",
  "Affectionate",
];

const LOCATION_POOL = [
  "Iloilo City",
  "Jaro, Iloilo",
  "La Paz, Iloilo",
  "Molo, Iloilo",
  "Mandurriao, Iloilo",
  "Arevalo, Iloilo",
  "Pavia, Iloilo",
  "Leganes, Iloilo",
  "Oton, Iloilo",
  "Sta. Barbara, Iloilo",
  "San Miguel, Iloilo",
  "Guimbal, Iloilo",
];

const STORY_OPENINGS = [
  "{name} entered foster care after a difficult period outdoors, where consistent meals and rest were not always available.",
  "When {name} was first referred to foster support, caregivers prioritized stabilization, hydration, and stress reduction.",
  "Foster volunteers welcomed {name} into a quieter environment designed to rebuild trust and improve daily wellbeing.",
  "Early reports showed {name} needed close monitoring, a predictable schedule, and a calm recovery space.",
];

const STORY_PROGRESS = [
  "Within weeks, nutrition and routine transformed overall condition, with better activity levels and steadier behavior throughout the day.",
  "Regular meals, structured rest, and gentle handling helped improve confidence and reduce anxious responses.",
  "Step by step, caregivers observed stronger appetite, healthier movement, and more consistent social engagement.",
  "Through patient foster work, {name} regained strength and now responds positively to enrichment and supervised interaction.",
];

const STORY_PERSONALITY = [
  "Today, {name} shows a warm and responsive temperament, especially around familiar people and calm routines.",
  "In daily foster sessions, {name} is increasingly playful, curious, and comfortable with guided socialization.",
  "Care notes describe {name} as affectionate, adaptable, and motivated by patient reinforcement.",
  "With trust now established, {name} settles quickly, enjoys enrichment activities, and seeks gentle companionship.",
];

const STORY_ADOPTION = [
  "From ongoing updates in {location}, the foster team believes {name} is ready for a forever home that can continue this progress.",
  "At {shelter}, caregivers recommend adopters who can provide routine, attentive care, and long-term commitment.",
  "Current assessments indicate {name} can transition successfully to a family prepared for structured care and bonding time.",
  "The next chapter for {name} is placement with adopters who value stability, kindness, and consistent follow-through.",
];

const FALLBACK_NAME_BY_ID: Record<string, string> = {
  "fallback-foster-1": "Nelson",
  "fallback-foster-2": "Mochi",
  "fallback-foster-3": "Kopi",
  "fallback-foster-4": "Bituin",
  "fallback-foster-5": "Luna",
  "fallback-foster-6": "Toby",
  "fallback-foster-7": "Maple",
  "fallback-foster-8": "Choco",
};

const FALLBACK_NAME_POOL = ["Milo", "Nala", "Simba", "Oreo", "Pepper", "Coco", "Daisy", "Bruno"];

const FALLBACK_SHELTER_BY_ID: Record<string, string> = {
  "fallback-foster-1": "Ilonggo Puspins",
  "fallback-foster-2": "Happy Tails Rescue",
  "fallback-foster-3": "Paw Haven Iloilo",
  "fallback-foster-4": "Fur Friends Home",
  "fallback-foster-5": "Ilonggo Puspins",
  "fallback-foster-6": "Rescue Haven Iloilo",
  "fallback-foster-7": "Paw Haven Iloilo",
  "fallback-foster-8": "Fur Friends Home",
};

const FALLBACK_SHELTER_POOL = ["Ilonggo Puspins", "Paw Haven Iloilo", "Fur Friends Home", "Happy Tails Rescue", "Rescue Haven Iloilo"];

const pickById = (story: ExplorePet, pool: string[]) => {
  const key = story.id ?? story.name ?? "pet";
  const hash = Array.from(key).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return pool[hash % pool.length];
};

const pickBySeed = (seed: string, pool: string[]) => {
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return pool[hash % pool.length];
};

const pickCharacteristics = (story: ExplorePet, count = 6) => {
  const seed = story.id ?? story.name ?? "pet";
  const base = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return [...CHARACTERISTIC_POOL]
    .sort((a, b) => {
      const aScore = (Array.from(`${seed}:${a}`).reduce((acc, char) => acc + char.charCodeAt(0), 0) + base) % 997;
      const bScore = (Array.from(`${seed}:${b}`).reduce((acc, char) => acc + char.charCodeAt(0), 0) + base) % 997;
      return aScore - bScore;
    })
    .slice(0, count);
};

const pickLocation = (story: ExplorePet) => {
  const seed = story.id ?? story.name ?? "pet";
  const score = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return LOCATION_POOL[score % LOCATION_POOL.length];
};

const getStoryBody = (story: ExplorePet) => {
  const caption = story.pet_media.find((media) => media.caption?.trim())?.caption?.trim();
  const petName = story.name ?? "This pet";
  const shelterName = story.shelter?.shelter_name ?? "the shelter";
  const location = pickLocation(story);

  const opening = pickById(story, STORY_OPENINGS).replaceAll("{name}", petName);
  const progress = pickById(story, STORY_PROGRESS).replaceAll("{name}", petName);
  const personality = pickById(story, STORY_PERSONALITY).replaceAll("{name}", petName);
  const adoption = pickById(story, STORY_ADOPTION)
    .replaceAll("{name}", petName)
    .replaceAll("{location}", location)
    .replaceAll("{shelter}", shelterName);

  const captionLead = caption ? `${caption} ` : "";
  return `${captionLead}${opening} ${progress} ${personality} ${adoption}`;
};

const getPhoto = (story: ExplorePet) => {
  return story.pet_media.find((media) => media.type === "photo" && Boolean(media.url))?.url;
};

const getPhotos = (story: ExplorePet) => {
  return story.pet_media
    .filter((media) => media.type === "photo" && Boolean(media.url))
    .map((media) => media.url);
};

export default async function FosterStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const feed = (await getFeed(60)) as ExplorePet[];
  const selected = feed.find((item) => item.id === id);
  const fallbackName = FALLBACK_NAME_BY_ID[id] ?? pickBySeed(`${id}:name`, FALLBACK_NAME_POOL);
  const fallbackShelter = FALLBACK_SHELTER_BY_ID[id] ?? pickBySeed(`${id}:shelter`, FALLBACK_SHELTER_POOL);

  const fallback: ExplorePet = {
    id,
    name: fallbackName,
    shelter: { shelter_name: fallbackShelter },
    pet_media: [
      {
        type: "photo",
        url: "",
        caption: "A foster journey full of resilience and hope.",
      },
    ],
  };

  const lead = selected ?? fallback;
  const mainPhoto = getPhoto(lead);
  const thumbs = getPhotos(lead).slice(0, 3);
  const petName = lead.name ?? "Pet Name";
  const shelterName = lead.shelter?.shelter_name ?? "Shelter Name";
  const title = `\"${petName}\"`;
  const storyBody = getStoryBody(lead);
  const characteristicTags = pickCharacteristics(lead);
  const location = pickLocation(lead);

  return (
    <div className="min-h-[85vh] bg-[#fff9ed] p-6 md:p-10">
      <div className="mx-auto w-full max-w-6xl rounded-[15px] bg-[#f3be0f] p-8 md:p-12">
        <div className="relative w-full rounded-[15px] bg-[#fff9ed] p-[1cm]">
          <Link href="/site/foster" aria-label="Back to foster story" className="absolute left-4 top-4 inline-flex cursor-pointer text-black">
            <span className="text-2xl">&#8249;</span>
          </Link>

          <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
            <div className="pt-8 lg:pt-12">
              {mainPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mainPhoto} alt={petName} className="h-48 w-full rounded-2xl bg-[#f08c00] object-cover" />
              ) : (
                <div className="h-48 w-full rounded-2xl bg-[#f08c00]" />
              )}

              <div className="mt-4 grid grid-cols-3 gap-3">
                {thumbs.map((thumb, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={`${thumb}-${index}`} src={thumb} alt={`${petName} thumbnail ${index + 1}`} className="h-16 w-full rounded-xl object-cover" />
                ))}
                {Array.from({ length: Math.max(0, 3 - thumbs.length) }).map((_, index) => (
                  <div key={`thumb-placeholder-${index}`} className="h-16 w-full rounded-xl bg-[#ffec99]" />
                ))}
              </div>

              <FosterAdoptButton petId={lead.id} />
            </div>

            <div className="pt-8 lg:pt-10">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-wide text-black">{petName}</h1>
                  <p className="mt-1 text-lg tracking-wide text-black">{shelterName}</p>
                  <p className="text-base tracking-wide text-black">{location}</p>
                </div>

                <LikeButton targetType="pet" targetId={lead.id} theme="foster" size={80} />
              </div>

              <section className="mt-4">
                <h2 className="text-xl font-bold tracking-wide text-black">Characteristics</h2>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {characteristicTags.map((label, index) => (
                    <div key={`${label}-${index}`} className="flex items-center justify-center gap-2 rounded-lg bg-[#f3be0f] px-2 py-2 text-white">
                      <span className="text-sm">&#10003;</span>
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-6">
                <h2 className="text-xl font-bold tracking-wide text-black">Information</h2>
                <h3 className="mt-3 text-xl font-bold text-black">{title}</h3>
                <p className="mt-2 text-justify text-base leading-7 tracking-wide text-black/85">{storyBody}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
