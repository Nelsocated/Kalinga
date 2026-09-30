import { notFound } from "next/navigation";
import ShelterProfileClient from "./ShelterProfileClient";
import ContactRows from "@/src/components/template/ContactRows";
import ProfileTabs from "@/src/components/tabs/ProfileTab";
import {
  fetchShelterById,
  getShelterPostedPets,
} from "@/src/lib/services/shelterService";

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
    contact: (
      <ContactRows email={shelter.contact_email} phone={shelter.contact_phone} />
    ),
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
