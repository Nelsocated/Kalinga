import ShelterCard from "@/components/cards/ShelterCard";
import { headers } from "next/headers";

async function getSheltersFromApi() {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  if (!host) return [];

  const res = await fetch(`${protocol}://${host}/api/shelters`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  return res.json();
}

export default async function Explore() {
  const shelters = await getSheltersFromApi();

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex pl-20">
        <div className="w-full max-w-5xl rounded-xl bg-primary">
          <div className="p-5 text-6xl font-bold ml-6">Shelters</div>

          <main className="h-screen w-full rounded-2xl bg-white border-4 border-primary overflow-y-auto">
            <div className="flex flex-col gap-3 m-4">
              {shelters.length === 0 ? (
                <div className="text-2xl opacity-70">No shelters found.</div>
              ) : (
                shelters.map((shelter: any) => (
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
