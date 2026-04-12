import { redirect } from "next/navigation";
import WriteFosterClient from "./WriteFosterClient";
import { getUserId } from "@/lib/utils/getUserId";
import {
  getShelterPets,
  getShelterIdByOwnerId,
} from "@/lib/services/shelter/shelterService";
import type { PetCardProps } from "@/lib/types/shelters";

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

  return <WriteFosterClient pets={pets} initialError={initialError} />;
}
