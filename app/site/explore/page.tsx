import ExplorePageView from "./ExplorePage";
import { getLongestPets, type LongestPet } from "@/lib/services/longest";
import { getFosterStories, type FosterStory } from "@/lib/services/foster";

export type ExplorePageProps = {
  longest: LongestPet[];
  foster: FosterStory[];
};

export default async function Page() {
  const [longestResult, fosterResult] = await Promise.allSettled([
    getLongestPets(10),
    getFosterStories(20),
  ]);

  const longest =
    longestResult.status === "fulfilled" ? longestResult.value : [];
  const foster = fosterResult.status === "fulfilled" ? fosterResult.value : [];

  if (longestResult.status === "rejected") {
    console.error(
      "[Explore/Page] getLongestPets failed:",
      longestResult.reason,
    );
  }
  if (fosterResult.status === "rejected") {
    console.error(
      "[Explore/Page] getFosterStories failed:",
      fosterResult.reason,
    );
  }

  return <ExplorePageView longest={longest} foster={foster} />;
}
