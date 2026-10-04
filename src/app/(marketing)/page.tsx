import Hero from "@/src/components/landing/Hero";
import HowItWorks from "@/src/components/landing/HowItWorks";
import FeaturedPets from "@/src/components/landing/FeaturedPets";
import ForShelters from "@/src/components/landing/ForShelters";
import FinalCta from "@/src/components/landing/FinalCta";
import type { StripVideo } from "@/src/components/landing/FilmStrip";
import { getFeed } from "@/src/lib/services/feedService";
import { getLongestStayPets, getPetsByIds } from "@/src/lib/services/petService";

// Refresh the live videos and pets every few minutes
export const revalidate = 300;

const MAX_STRIP_VIDEOS = 8;

export default async function LandingPage() {
  const [feed, pets] = await Promise.all([
    getFeed().catch(() => []),
    getLongestStayPets(5).catch(() => []),
  ]);

  const picked = feed.filter((item) => item.url).slice(0, MAX_STRIP_VIDEOS);

  // Tiles show the pet's photo; a full video file is too heavy to load per visit
  const stripPets = await getPetsByIds(picked.map((item) => item.pet_id)).catch(() => []);
  const photoByPet = new Map(stripPets.map((pet) => [pet.id, pet.photo_url?.trim() || null]));

  const videos: StripVideo[] = picked.map((item) => ({
    mediaId: item.media_id,
    url: item.url,
    posterUrl: photoByPet.get(item.pet_id) ?? null,
    petName: item.name || "A Kalinga pet",
    shelterName: item.shelter?.shelter_name ?? "Kalinga shelter",
  }));

  return (
    <>
      <Hero videos={videos} />
      <HowItWorks />
      <FeaturedPets pets={pets} />
      <ForShelters />
      <FinalCta videos={videos} />
    </>
  );
}
