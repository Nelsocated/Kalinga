import { notFound, redirect } from "next/navigation";
import ShelterProfileClient, {
  type ShelterProfileUI,
} from "./ShelterProfileClient";
import ProfileTabs from "@/components/tabs/ProfileTab";
import { requireShelter } from "@/lib/utils/auth";
import { getShelterPetProps } from "@/lib/services/shelter/shelterService";
export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const auth = await requireShelter();
    const shelter = await getShelterPetProps(auth.id);

    if (!shelter) {
      notFound();
    }

    const mappedShelter: ShelterProfileUI = {
      id: shelter.id,
      shelter_name: shelter.shelter_name ?? "Unnamed Shelter",
      location: shelter.location ?? "",
      logo_url: shelter.logo_url ?? null,
      about: shelter.about ?? null,
      contact_email: shelter.contact_email ?? "",
      contact_phone: shelter.contact_phone ?? "",
      created_at: shelter.created_at ?? null,
      pets:
        shelter.pets?.map((pet) => ({
          id: pet.id,
          name: pet.name ?? "",
          sex: pet.sex ?? "unknown",
          photo_url: pet.photo_url ?? null,
        })) ?? [],
    };

    return (
      <ShelterProfileClient
        shelter={mappedShelter}
        tabs={<ProfileTabs role="shelter" shelterId={shelter.id} />}
      />
    );
  } catch {
    redirect("/");
  }
}
