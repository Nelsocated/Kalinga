import ExplorePageView from "./ExplorePage";
import {
  getLongestStayPets,
  getPetsByIds,
} from "@/lib/services/pet/petService";
import { getSheltersByIds } from "@/lib/services/shelterService";
import { getFosterStories } from "@/lib/services/fosterService";

export const dynamic = "force-dynamic";

type PetGender = "male" | "female" | "unknown";

type LongestPet = {
  id: string;
  shelter_id: string;
  years_inShelter: number | null;
  name: string | null;
  sex: PetGender;
  photo_url: string | null;
  shelter_name: string | null;
  shelter_logo_url: string | null;
};

type FosterStory = {
  id: string;
  pet_id: string;
  title: string | null;
  description: string | null;
  pet_name: string | null;
  pet_sex: PetGender;
  pet_photo_url: string | null;
  shelter_name: string | null;
  shelter_logo_url: string | null;
};

export default async function Page() {
  const longestBase = await getLongestStayPets(10);
  const fosterBase = await getFosterStories(20);

  const longestShelterIds = [
    ...new Set(
      longestBase
        .map((pet) => pet.shelter_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const longestShelters =
    longestShelterIds.length > 0
      ? await getSheltersByIds(longestShelterIds)
      : [];

  const longestShelterMap = new Map(
    longestShelters.map((shelter) => [String(shelter.id), shelter]),
  );

  const longest: LongestPet[] = longestBase.map((pet) => {
    const shelter = longestShelterMap.get(String(pet.shelter_id));

    return {
      id: String(pet.id),
      shelter_id: String(pet.shelter_id),
      years_inShelter: pet.years_inShelter ?? null,
      name: pet.pet_name ?? null,
      sex:
        pet.sex === "male" || pet.sex === "female" || pet.sex === "unknown"
          ? pet.sex
          : "unknown",
      photo_url: pet.photo_url ?? null,
      shelter_name: shelter?.shelter_name ?? null,
      shelter_logo_url: shelter?.logo_url ?? null,
    };
  });

  const fosterPetIds = fosterBase.map((item) => item.pet_id);
  const fosterPets =
    fosterPetIds.length > 0 ? await getPetsByIds(fosterPetIds) : [];
  const petMap = new Map(fosterPets.map((pet) => [String(pet.id), pet]));

  const fosterShelterIds = [
    ...new Set(
      fosterPets
        .map((pet) => pet.shelter_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const fosterShelters =
    fosterShelterIds.length > 0 ? await getSheltersByIds(fosterShelterIds) : [];

  const fosterShelterMap = new Map(
    fosterShelters.map((shelter) => [String(shelter.id), shelter]),
  );

  const foster: FosterStory[] = fosterBase.map((story) => {
    const pet = petMap.get(String(story.pet_id));
    const shelter = pet?.shelter_id
      ? fosterShelterMap.get(String(pet.shelter_id))
      : null;

    return {
      id: String(story.id),
      pet_id: String(story.pet_id),
      title: story.title ?? null,
      description: story.description ?? null,
      pet_name: pet?.pet_name ?? null,
      pet_sex:
        pet?.sex === "male" || pet?.sex === "female" || pet?.sex === "unknown"
          ? pet.sex
          : "unknown",
      pet_photo_url: pet?.photo_url ?? null,
      shelter_name: shelter?.shelter_name ?? null,
      shelter_logo_url: shelter?.logo_url ?? null,
    };
  });

  return <ExplorePageView longest={longest} foster={foster} />;
}
