import "server-only";
import { redirect } from "next/navigation";
import { getUserId } from "@/src/lib/utils/auth";
import { getShelterIdByOwnerId, getShelterPets } from "@/src/lib/services/shelterService";
import type { PetCardProps } from "@/src/lib/types/shelters";

/**
 * The signed-in shelter's pets for the creation forms, plus the pet picked by `?pet=`
 * when it is one of theirs.
 */
export async function loadShelterPets(petParam: string | string[] | undefined) {
  const ownerId = await getUserId();
  if (!ownerId) redirect("/login");

  let pets: PetCardProps[] = [];
  let initialError: string | null = null;

  try {
    const shelterId = await getShelterIdByOwnerId(ownerId);
    if (!shelterId) initialError = "Shelter not found.";
    else pets = await getShelterPets(shelterId);
  } catch (error) {
    initialError = error instanceof Error ? error.message : "Couldn't load your pets.";
  }

  const wanted = typeof petParam === "string" ? petParam : undefined;
  const initialPetId = pets.some((pet) => pet.id === wanted) ? wanted! : "";

  return { pets, initialError, initialPetId };
}
