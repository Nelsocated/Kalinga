import { notFound } from "next/navigation";
import ShelterProfilePage from "./ShelterProfilePage";
import { getShelterProfile } from "@/lib/db/profiles";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getShelterProfile(id).catch(() => null);
  if (!data) return notFound();

  const shelter = {
    id: data.id,
    shelter_name: data.shelter_name,
    logo_url: data.logo_url ?? null,
    location: data.location ?? null,
    about: data.about ?? null,
    contact:
      [data.contact_email, data.contact_phone].filter(Boolean).join(" • ") ||
      null,
    created_at: data.created_at,
    pets:
      data.pets?.map((pet: any) => ({
        id: pet.id,
        name: pet.name,
        sex: pet.sex,
        photo_url: pet.photo_url ?? null,
      })) ?? [],
  };

  return <ShelterProfilePage shelter={shelter} />;
}
