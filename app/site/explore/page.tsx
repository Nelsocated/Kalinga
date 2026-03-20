import ExtendedExplore from "@/components/explore/ExtendedExplore";
import { ExplorePet } from "@/components/explore/types";
import NavBar from "@/components/layout/NavBar";
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
  return (
    <div className="flex min-h-svh gap-6 bg-background px-6 md:px-8 lg:gap-8 xl:px-10">
      <NavBar />
      <main className="min-w-0 flex-1 py-6 lg:py-8">
        <div className="mx-auto w-full max-w-[1180px] px-2 md:px-4">
          <ExtendedExplore residents={residents} stories={stories} />
        </div>
      </main>
    </div>
  );
}
