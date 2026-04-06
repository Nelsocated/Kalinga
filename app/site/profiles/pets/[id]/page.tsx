import { notFound } from "next/navigation";
import PetProfileClient from "./PetProfileClient";
import { getPetById } from "@/lib/services/pet/petService";
import { getPetPhotosByPetId } from "@/lib/services/petMediaService";
import { fetchShelterById } from "@/lib/services/shelter/shelterService";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PetProfilePage({ params }: PageProps) {
  const { id } = await params;

  const pet = await getPetById(id);

  if (!pet) {
    return notFound();
  }

  const [shelter, petMedia] = await Promise.all([
    pet.shelter_id ? fetchShelterById(pet.shelter_id) : Promise.resolve(null),
    getPetPhotosByPetId(pet.id),
  ]);

  const mappedPet = {
    id: pet.id,
    name: pet.pet_name || "Unknown Pet",
    description: pet.description || null,
    age_label: formatLabel(pet.age, pet.species) || null,
    breed: formatLabel(pet.breed) || "Unknown Breed",
    species: formatLabel(pet.species) || "Unknown Species",
    vaccinated: pet.vaccinated,
    spayed_neutered: pet.spayed_neutered,
    sex: pet.sex ?? null,
    size: formatLabel(pet.size) || null,
    photo_url: pet.photo_url || null,
    shelter: shelter
      ? {
          id: shelter.id,
          shelter_name: shelter.shelter_name ?? null,
          logo_url: shelter.logo_url ?? null,
          location: shelter.location ?? null,
        }
      : null,
    pet_media: petMedia.map((media) => ({
      id: media.id,
      type: media.type,
      url: media.url,
      caption: media.caption ?? null,
    })),
  };

  return <PetProfileClient id={id} initialPet={mappedPet} />;
}

function formatLabel(value: string | null, species?: string | null): string {
  if (!value) return "Unknown";

  // Handle age: puppy_kitten → based on species
  if (value === "kitten/puppy") {
    return species === "cat" ? "Kitten" : "Puppy";
  }

  // Capitalize first letter, replace underscores with spaces
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
