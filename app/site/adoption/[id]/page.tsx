import AdoptionApplicationForm from "@/components/explore/AdoptionApplicationForm";
import { ExplorePet } from "@/components/explore/types";
import { getFeed } from "@/lib/services/feed";

export default async function AdoptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const feed = await getFeed(50);
  const selected = (feed as ExplorePet[]).find((item) => item.id === id);

  const petName = selected?.name ?? id.replace(/-/g, " ");
  const shelterName = selected?.shelter?.shelter_name ?? "Kalinga Shelter";

  return (
    <AdoptionApplicationForm
      petId={id}
      petName={petName}
      shelterName={shelterName}
    />
  );
}
