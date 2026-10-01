import Hero from "@/src/components/landing/Hero";
import HowItWorks from "@/src/components/landing/HowItWorks";
import FeaturedPets from "@/src/components/landing/FeaturedPets";
import ForShelters from "@/src/components/landing/ForShelters";
import FinalCta from "@/src/components/landing/FinalCta";
import type { StripVideo } from "@/src/components/landing/FilmStrip";
import { getFeed } from "@/src/lib/services/feedService";
import { getLongestStayPets } from "@/src/lib/services/petService";

// Refresh the live videos and pets every few minutes
export const revalidate = 300;

const MAX_STRIP_VIDEOS = 8;

export default async function LandingPage() {
  const [feed, pets] = await Promise.all([
    getFeed().catch(() => []),
    getLongestStayPets(5).catch(() => []),
  ]);

  const videos: StripVideo[] = feed
    .filter((item) => item.url)
    .slice(0, MAX_STRIP_VIDEOS)
    .map((item) => ({
      mediaId: item.media_id,
      url: item.url,
      petName: item.name || "A Kalinga pet",
      shelterName: item.shelter?.shelter_name ?? "Kalinga shelter",
    }));

  return (
    <>
      <Hero videos={videos} />
      <HowItWorks />
      <FeaturedPets pets={pets} />
      <ForShelters />
      <FinalCta />
    </>
  );
}
