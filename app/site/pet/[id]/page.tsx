import PetProfile from "@/components/explore/PetProfile";
import { ExplorePet } from "@/components/explore/types";
import { getFeed } from "@/lib/services/feed";

const FALLBACK_PET_BY_ID: Record<string, { name: string; shelter: string; caption: string }> = {
    "fallback-resident-1": {
        name: "Nelson",
        shelter: "Kalinga Shelter",
        caption: "Nelson is still waiting for his forever home. Reach out to the shelter for full details.",
    },
    "fallback-resident-2": {
        name: "Mochi",
        shelter: "Paw Haven",
        caption: "Mochi is available for adoption and ready to meet a loving family.",
    },
    "fallback-resident-3": {
        name: "Kopi",
        shelter: "Happy Tails",
        caption: "Kopi is a gentle companion looking for a safe, caring home.",
    },
    "fallback-resident-4": {
        name: "Bituin",
        shelter: "Fur Friends",
        caption: "Bituin is healthy and adoptable. Contact the shelter for personality and care info.",
    },
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const feed = await getFeed(50);
    const selected = (feed as ExplorePet[]).find((item) => item.id === id);
    const fallbackMeta = FALLBACK_PET_BY_ID[id];

    const fallbackPet: ExplorePet = {
        id,
        name: fallbackMeta?.name ?? "Pet Profile",
        shelter: { shelter_name: fallbackMeta?.shelter ?? "Kalinga Shelter" },
        pet_media: [
            {
                type: "photo",
                url: "",
                caption: fallbackMeta?.caption
                    ?? "This pet profile is being prepared. Please contact the shelter for complete adoption details.",
            },
        ],
    };

    return <PetProfile item={selected ?? fallbackPet} />;
}