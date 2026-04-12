import WebTemplate from "@/src/components/template/WebTemplate";
import ShelterCard from "@/src/components/cards/ShelterCard";
import { getSheltersWithStats } from "@/src/lib/services/shelter/shelterService";

export default async function Explore() {
  const shelters = await getSheltersWithStats().catch(() => []);

  return (
    <WebTemplate
      header={<div>Shelters</div>}
      main={
        <main className="pt-2">
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
      }
    />
  );
}
