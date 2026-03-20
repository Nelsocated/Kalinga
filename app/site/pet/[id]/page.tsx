import PetProfile from "@/components/explore/PetProfile";
import { ExplorePet } from "@/components/explore/types";
import NavBar from "@/components/layout/NavBar";
import { getPetProfile } from "@/lib/db/profiles";

const PET_NAMES = ["Brownie", "Luna", "Mochi", "Biscuit", "Coco", "Peanut", "Kimchi", "Patches", "Shadow", "Ginger", "Tofu", "Nugget", "Pepper", "Oreo", "Caramel", "Mocha"];
const SHELTERS = ["Paws of Hope", "Kalinga Shelter", "Happy Tails", "Furry Friends", "Safe Haven", "Second Chance", "New Beginnings", "Loving Paws"];

function hashId(id: string) {
  return Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

function fallbackPet(id: string): ExplorePet {
  const h = hashId(id);
  return {
    id,
    name: PET_NAMES[h % PET_NAMES.length],
    shelter: { shelter_name: SHELTERS[h % SHELTERS.length] },
    pet_media: [
      {
        type: "photo",
        url: "",
        caption:
          "This pet profile is being prepared. Please contact the shelter for complete adoption details.",
      },
    ],
  };
}

export default async function PetPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ name?: string; shelter?: string }> }) {
  const { id } = await params;
  const query = await searchParams;

  let selected: ExplorePet | undefined;

  try {
    const pet = await getPetProfile(id);
    if (pet) {
      selected = {
        id: pet.id,
        name: pet.name,
        shelter: pet.shelter ? { shelter_name: (pet.shelter as any).shelter_name } : null,
        pet_media: (pet.pet_media ?? []).map((m: any) => ({
          type: m.type,
          url: m.url,
          caption: m.caption,
        })),
      };
    }
  } catch {
    selected = undefined;
  }

  // Use query params if DB fetch didn't return data
  if (!selected) {
    const fb = fallbackPet(id);
    selected = {
      ...fb,
      name: query.name ?? fb.name,
      shelter: { shelter_name: query.shelter ?? fb.shelter?.shelter_name ?? "Shelter" },
    };
  }

  return (
    <div className="flex min-h-svh gap-6 bg-background px-6 md:px-8 lg:gap-8 xl:px-10">
      <NavBar />
      <main className="min-w-0 flex-1 py-6 lg:py-8">
        <div className="mx-auto w-full max-w-[1180px] px-2 md:px-4">
          <PetProfile item={selected} />
        </div>
      </main>
    </div>
  );
}
