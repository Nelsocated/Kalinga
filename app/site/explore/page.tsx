import ExtendedExplore from "@/components/explore/ExtendedExplore";
import { ExplorePet } from "@/components/explore/types";
import { getFeed } from "@/lib/services/feed";

export default async function ExplorePage() {
  let items: ExplorePet[] = [];

  try {
    const feed = await getFeed(20);
    items = (feed ?? []) as ExplorePet[];
  } catch {
    items = [];
  }

  const residents = items.slice(0, 8);
  const stories = items.slice(8);
  return <ExtendedExplore residents={residents} stories={stories} />;
}