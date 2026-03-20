import ShelterCard from "@/components/cards/ShelterCard";
import { getSheltersWithStats } from "@/lib/services/shelterService";

export default async function Explore() {
  const shelters = await getSheltersWithStats().catch(() => []);

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-1 pl-20">
        <div className="flex h-full w-full max-w-5xl flex-col rounded-[15px] bg-primary">
          <div className="ml-6 p-5 text-6xl font-bold">Shelters</div>

          <main className="flex-1 overflow-y-auto scroll-stable rounded-[15px] border-2 bg-white">
            <div className="m-4 flex flex-col gap-3">
              {shelters.length === 0 ? (
                <div className="text-2xl opacity-70">No shelters found.</div>
              ) : (
                shelters.map((shelter) => (
                  <ShelterCard
                    key={shelter.id}
                    id={shelter.id}
                    href={`/site/profiles/shelter/${shelter.id}`}
                    imageUrl={shelter.logo_url}
                    name={shelter.shelter_name ?? "Unnamed Shelter"}
                    location={shelter.location}
                    petsAvailable={shelter.total_available_pets ?? 0}
                    petsAdopted={shelter.total_adopted_pets ?? 0}
                  />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
