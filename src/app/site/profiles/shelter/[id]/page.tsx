import { notFound } from "next/navigation";
import ShelterProfileClient from "./ShelterProfileClient";
import ProfileTabs from "@/src/components/tabs/ProfileTab";
import {
  fetchShelterById,
  getShelterPostedPets,
} from "@/src/lib/services/shelter/shelterService";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [shelter, pets] = await Promise.all([
    fetchShelterById(id),
    getShelterPostedPets(id),
  ]);

  if (!shelter) {
    return notFound();
  }

  const mappedShelter = {
    id: shelter.id,
    shelter_name: shelter.shelter_name,
    logo_url: shelter.logo_url ?? null,
    location: shelter.location ?? null,
    about: shelter.about ?? null,
    contact:
      shelter.contact_email || shelter.contact_phone ? (
        <div className="flex flex-col">
          {shelter.contact_email && <span>{shelter.contact_email}</span>}
          {shelter.contact_phone && <span>{shelter.contact_phone}</span>}
        </div>
      ) : null,
    created_at: shelter.created_at ?? null,
    pets: pets.map((pet) => ({
      id: pet.id,
      name: pet.petName ?? "Unknown Pet",
      sex: pet.gender ?? "unknown",
      photo_url: pet.imageUrl ?? null,
    })),
  };

  return (
    <>
      <ShelterProfileClient
        shelter={mappedShelter}
        tabs={<ProfileTabs role="shelter" shelterId={shelter.id} />}
      />
    </>
  );
}
