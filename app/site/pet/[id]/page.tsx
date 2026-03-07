import PetProfile from "@/components/explore/PetProfile";
import { ExplorePet } from "@/components/explore/types";
import { getFeed } from "@/lib/services/feed";

const FALLBACK_PET_BY_ID: Record<string, { name: string; shelter: string; caption: string }> = {
    "fallback-foster-1": {
        name: "Nelson",
        shelter: "Ilonggo Puspins",
        caption: "Nelson is recovering well in foster care and is learning to trust people again.",
    },
    "fallback-foster-2": {
        name: "Mochi",
        shelter: "Happy Tails Rescue",
        caption: "Mochi is playful, gentle, and currently thriving in a stable foster routine.",
    },
    "fallback-foster-3": {
        name: "Kopi",
        shelter: "Paw Haven Iloilo",
        caption: "Kopi is gaining confidence in foster care and enjoys short play sessions with volunteers.",
    },
    "fallback-foster-4": {
        name: "Bituin",
        shelter: "Fur Friends Home",
        caption: "Bituin has adjusted well to a stable routine and continues to improve each week.",
    },
    "fallback-foster-5": {
        name: "Luna",
        shelter: "Ilonggo Puspins",
        caption: "Luna is affectionate, observant, and now comfortable around familiar foster staff.",
    },
    "fallback-foster-6": {
        name: "Toby",
        shelter: "Rescue Haven Iloilo",
        caption: "Toby responds well to enrichment activities and is steadily improving social behavior.",
    },
    "fallback-foster-7": {
        name: "Maple",
        shelter: "Paw Haven Iloilo",
        caption: "Maple is recovering nicely and now follows a calm daily feeding and rest routine.",
    },
    "fallback-foster-8": {
        name: "Choco",
        shelter: "Fur Friends Home",
        caption: "Choco has become more playful in foster and is ready to meet potential adopters soon.",
    },
    "fallback-resident-1": {
        name: "Nelson",
        shelter: "Ilonggo Puspins",
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

const FALLBACK_NAME_POOL = ["Milo", "Nala", "Simba", "Oreo", "Pepper", "Coco", "Daisy", "Bruno"];
const FALLBACK_SHELTER_POOL = ["Ilonggo Puspins", "Paw Haven Iloilo", "Fur Friends Home", "Happy Tails Rescue", "Rescue Haven Iloilo"];

const pickBySeed = (seed: string, pool: string[]) => {
    const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return pool[hash % pool.length];
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const feed = await getFeed(50);
    const selected = (feed as ExplorePet[]).find((item) => item.id === id);
    const fallbackMeta = FALLBACK_PET_BY_ID[id];
    const fallbackName = fallbackMeta?.name ?? pickBySeed(`${id}:name`, FALLBACK_NAME_POOL);
    const fallbackShelter = fallbackMeta?.shelter ?? pickBySeed(`${id}:shelter`, FALLBACK_SHELTER_POOL);

    const fallbackPet: ExplorePet = {
        id,
        name: fallbackName,
        shelter: { shelter_name: fallbackShelter },
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