"use client";

import { useState } from "react";
import { House, MagnifyingGlass } from "@phosphor-icons/react";
import WebTemplate from "@/src/components/template/WebTemplate";
import ShelterCard from "@/src/components/cards/ShelterCard";
import EmptyState from "@/src/components/ui/EmptyState";
import Button from "@/src/components/ui/Button";
import SearchField, { matchesQuery } from "@/src/components/ui/SearchField";
import type { ShelterListItem } from "@/src/lib/types/shelters";

/** The shelters list with a name / location search over the loaded shelters. */
export default function SheltersView({ shelters }: { shelters: ShelterListItem[] | null }) {
  const [query, setQuery] = useState("");
  const visible = (shelters ?? []).filter((s) => matchesQuery(query, s.shelter_name, s.location));

  return (
    <WebTemplate
      header="Shelters"
      top={
        shelters?.length ? (
          <SearchField
            value={query}
            onChange={setQuery}
            label="Search shelters"
            placeholder="Search by name or location"
          />
        ) : null
      }
      main={
        shelters === null ? (
          <p role="alert" className="rounded-md bg-reject/10 px-4 py-3 text-sm text-reject-text">
            We couldn&apos;t load shelters right now. Refresh the page to try again.
          </p>
        ) : shelters.length === 0 ? (
          <EmptyState icon={<House aria-hidden="true" />} title="No shelters yet" />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<MagnifyingGlass aria-hidden="true" />}
            title={`No shelters match "${query.trim()}"`}
            description="Try another name or place."
            action={
              <Button variant="secondary" onClick={() => setQuery("")}>
                Clear search
              </Button>
            }
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {visible.map((shelter) => (
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
