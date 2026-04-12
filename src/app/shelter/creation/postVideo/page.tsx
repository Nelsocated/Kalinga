import { redirect } from "next/navigation";
import PostVideoClient from "./PostVideoClient";
import { getUserId } from "@/src/lib/utils/getUserId";
import {
  getShelterPets,
  getShelterIdByOwnerId,
} from "@/src/lib/services/shelter/shelterService";
import type { PetCardProps } from "@/src/lib/types/shelters";

export const dynamic = "force-dynamic";

export default async function Page() {
  const ownerId = await getUserId();

  if (!ownerId) redirect("/login");

  let pets: PetCardProps[] = [];
  let initialError: string | null = null;

  try {
    const shelterId = await getShelterIdByOwnerId(ownerId);

    if (!shelterId) {
      initialError = "Shelter not found.";
    } else {
      pets = await getShelterPets(shelterId);
    }
  } catch (error) {
    initialError =
      error instanceof Error ? error.message : "Failed to load pets.";
  }

  return <PostVideoClient pets={pets} initialError={initialError} />;
}
