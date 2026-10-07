import PostVideoClient from "./PostVideoClient";
import { loadShelterPets } from "../loadShelterPets";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ pet?: string | string[] }> };

export default async function Page({ searchParams }: PageProps) {
  const { pet } = await searchParams;

  return <PostVideoClient {...await loadShelterPets(pet)} />;
}
