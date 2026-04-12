import NotifShelter from "./NotifShelter";
import { getUserId } from "@/lib/utils/getUserId";
import { getShelterIdByOwnerId } from "@/lib/services/shelter/shelterService";
import { getShelterAdoptionNotifications } from "@/lib/services/adoption/adoptionService";
import { getPetById } from "@/lib/services/pet/petService";
import { getUserById } from "@/lib/services/user/usersService";
import type { PetGender } from "@/lib/types/shelters";
import type { ShelterNotifItem, ShelterAdoptionStatus } from "./NotifShelter";

type RawNotification = {
  id: string;
  pet_id: string | null;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
  status: string;
};

function normalizeSpecies(
  value: string | null | undefined,
): "dog" | "cat" | null {
  if (!value) return null;

  const normalized = value.toLowerCase().trim();

  if (normalized === "dog" || normalized === "dogs") return "dog";
  if (normalized === "cat" || normalized === "cats") return "cat";

  return null;
}

function normalizeStatus(value: string): ShelterAdoptionStatus {
  const normalized = value.toLowerCase().trim();

  switch (normalized) {
    case "pending":
      return "pending";
    case "under_review":
    case "under review":
      return "under_review";
    case "contacting_applicant":
    case "contacting applicant":
      return "contacting_applicant";
    case "not_approved":
    case "not approved":
      return "not_approved";
    case "approved":
      return "approved";
    case "withdrawn":
      return "withdrawn";
    case "adopted":
      return "adopted";
    default:
      return "pending";
  }
}

function normalizeSex(value: string | null | undefined): PetGender {
  if (!value) return "unknown";

  const normalized = value.toLowerCase().trim();

  if (normalized === "male" || normalized === "female") {
    return normalized;
  }

  return "unknown";
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function getNotifications(
  shelterId: string,
): Promise<ShelterNotifItem[]> {
  const data = (await getShelterAdoptionNotifications(
    shelterId,
  )) as RawNotification[];

  return Promise.all(
    data.map(async (item) => {
      const [pet, applicant] = await Promise.all([
        item.pet_id ? getPetById(item.pet_id) : Promise.resolve(null),
        item.user_id ? getUserById(item.user_id) : Promise.resolve(null),
      ]);

      const fallbackDate =
        item.updated_at ?? item.created_at ?? new Date().toISOString();

      return {
        id: item.id,
        petId: item.pet_id ?? "",
        petName: pet?.pet_name ?? "Unknown Pet",
        petPhotoUrl: pet?.photo_url ?? null,
        species: normalizeSpecies(pet?.species),
        applicantId: item.user_id,
        applicantName:
          applicant?.full_name ?? applicant?.username ?? "Unknown User",
        applicantPhotoUrl: applicant?.photo_url ?? null,
        status: normalizeStatus(item.status),
        shelterId: shelterId,
        sex: normalizeSex(pet?.sex),
        submittedAt: item.created_at ?? null,
        updatedAt: item.updated_at ?? null,
        date: formatDate(fallbackDate),
      };
    }),
  );
}

export default async function Page() {
  const ownerId = await getUserId();

  if (!ownerId) {
    throw new Error("User not authenticated");
  }

  const shelterId = await getShelterIdByOwnerId(ownerId);

  if (!shelterId) {
    throw new Error("Shelter not found");
  }

  const [notifications] = await Promise.all([getNotifications(shelterId)]);

  return <NotifShelter items={notifications} />;
}
