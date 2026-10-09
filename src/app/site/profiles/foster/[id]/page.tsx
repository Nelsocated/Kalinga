import { notFound } from "next/navigation";
import FosterProfilePage from "./FosterProfilePage";
import { getFosterStoryById } from "@/src/lib/services/fosterService";
import { getPetPhotosByPetId } from "@/src/lib/services/petMediaService";
import type { PetGender } from "@/src/lib/types/shelters";

type PageProps = {
  params: Promise<{ id: string }>;
};

// The story is read from the database by id, so a link can't change what it says
export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const story = await getFosterStoryById(id);

  if (!story) return notFound();

  const pet = story.pets;
  const shelter = pet?.shelter;

  let photos: string[] = [];
  try {
    const media = await getPetPhotosByPetId(story.pet_id);
    photos = media.flatMap((item) => (item.url ? [item.url] : []));
  } catch (error) {
    console.error("[FosterProfile/Page] getPetPhotosByPetId failed:", error);
  }

  const sex: PetGender = pet?.sex === "male" || pet?.sex === "female" ? pet.sex : "unknown";

  return (
    <FosterProfilePage
      petId={story.pet_id}
      name={pet?.name?.trim() || "Unnamed pet"}
      sex={sex}
      photo_url={pet?.photo_url ?? ""}
      photos={photos}
      title={story.title?.trim() ?? ""}
      description={story.description?.trim() ?? ""}
      createdAt={story.created_at}
      shelter={
        shelter
          ? {
              id: shelter.id,
              name: shelter.shelter_name?.trim() || "Kalinga shelter",
              logo_url: shelter.logo_url,
              location: shelter.location,
            }
          : null
      }
    />
  );
}
