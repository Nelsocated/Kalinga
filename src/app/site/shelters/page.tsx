import { House } from "@phosphor-icons/react/dist/ssr";
import WebTemplate from "@/src/components/template/WebTemplate";
import ShelterCard from "@/src/components/cards/ShelterCard";
import EmptyState from "@/src/components/ui/EmptyState";
import { getSheltersWithStats } from "@/src/lib/services/shelterService";

export default async function SheltersPage() {
  const shelters = await getSheltersWithStats().catch(() => null);

  return (
    <WebTemplate
      header="Shelters"
      main={
        shelters === null ? (
          <p role="alert" className="rounded-md bg-reject/10 px-4 py-3 text-sm text-reject-text">
            We couldn&apos;t load shelters right now. Refresh the page to try again.
          </p>
        ) : shelters.length === 0 ? (
          <EmptyState icon={<House aria-hidden="true" />} title="No shelters yet" />
        ) : (
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {shelters.map((shelter) => (
              <li key={shelter.id}>
                <ShelterCard
                  id={shelter.id}
                  href={`/site/profiles/shelter/${shelter.id}`}
                  imageUrl={shelter.logo_url}
                  name={shelter.shelter_name ?? "Unnamed shelter"}
                  location={shelter.location}
                  petsAvailable={shelter.total_available_pets ?? 0}
                  petsAdopted={shelter.total_adopted_pets ?? 0}
                />
              </li>
            ))}
          </ul>
        )
      }
    />
  );
}
