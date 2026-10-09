import ExplorePageView from "./ExplorePage";
import { getLongestStayPets } from "@/src/lib/services/petService";
import { getFosterStories } from "@/src/lib/services/fosterService";

export const dynamic = "force-dynamic";

export type PetGender = "male" | "female" | "unknown";

export type LongestPet = {
  id: string;
  shelter_id: string;
  years_inShelter: number | null;
  name: string | null;
  sex: PetGender;
  photo_url: string | null;
  shelter_name: string | null;
  shelter_logo_url: string | null;
  shelter_location: string | null;
};

export type FosterStory = {
  id: string;
  pet_id: string;
  title: string | null;
  description: string | null;
  pet_name: string | null;
  pet_sex: PetGender;
  pet_photo_url: string | null;
  shelter_name: string | null;
  shelter_logo_url: string | null;
  shelter_location: string | null;
};

// Both sections bring their shelter (and the story's pet) in the same query, and run side by side
export default async function Page() {
  const [longestBase, stories] = await Promise.all([
    getLongestStayPets(10),
    getFosterStories(20),
  ]);

  const longest: LongestPet[] = longestBase.map((pet) => ({
    id: pet.id,
    shelter_id: pet.shelter_id,
    years_inShelter: pet.years_inShelter ?? null,
    name: pet.pet_name || null,
    sex: toGender(pet.sex),
    photo_url: pet.photo_url || null,
    shelter_name: pet.shelter?.shelter_name ?? null,
    shelter_logo_url: pet.shelter?.logo_url ?? null,
    shelter_location: pet.shelter?.location ?? null,
  }));

  const foster: FosterStory[] = stories.map((story) => ({
    id: story.id,
    pet_id: story.pet_id,
    title: story.title,
    description: story.description,
    pet_name: story.pets?.name ?? null,
    pet_sex: toGender(story.pets?.sex),
    pet_photo_url: story.pets?.photo_url ?? null,
    shelter_name: story.pets?.shelter?.shelter_name ?? null,
    shelter_logo_url: story.pets?.shelter?.logo_url ?? null,
    shelter_location: story.pets?.shelter?.location ?? null,
  }));

  return <ExplorePageView longest={longest} foster={foster} />;
}

function toGender(sex: string | null | undefined): PetGender {
  return sex === "male" || sex === "female" ? sex : "unknown";
}
