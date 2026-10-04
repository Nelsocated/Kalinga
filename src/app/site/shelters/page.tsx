import SheltersView from "./SheltersView";
import { getSheltersWithStats } from "@/src/lib/services/shelterService";

export default async function SheltersPage() {
  const shelters = await getSheltersWithStats().catch(() => null);

  return <SheltersView shelters={shelters} />;
}
