import FosterProfilePage from "./FosterProfilePage";
import { getPetPhotosByPetId } from "@/lib/services/petMediaService";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    petId?: string;
    name?: string;
    sex?: string;
    shelter_name?: string;
    logo_url?: string;
    location?: string;
    url?: string;
    title?: string;
    description?: string;
  }>;
};

type PetMediaPhoto = {
  id: string;
  type: "photo" | "video";
  url: string;
  caption: string | null;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const data = await searchParams;

  const petId = data.petId ?? "";

  let extraPhotos: PetMediaPhoto[] = [];

  try {
    if (petId) {
      const photos = await getPetPhotosByPetId(petId);

      extraPhotos = (photos ?? []).map((item) => ({
        id: String(item.id),
        type:
          item.type === "photo" || item.type === "video" ? item.type : "photo",
        url: item.url ?? "",
        caption: item.caption ?? null,
      }));
    }
  } catch (error) {
    console.error("[FosterProfile/Page] getPetPhotosByPetId failed:", error);
  }

  return (
    <FosterProfilePage
      id={id}
      petId={petId}
      name={data.name ?? "Unknown pet"}
      sex={data.sex ?? "unknown"}
      shelter_name={data.shelter_name ?? null}
      logo_url={data.logo_url ?? null}
      location={data.location ?? null}
      photo_url={data.url ?? ""}
      title={data.title ?? ""}
      description={data.description ?? ""}
      pet_media={extraPhotos}
    />
  );
}
