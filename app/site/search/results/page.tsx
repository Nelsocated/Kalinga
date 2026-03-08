"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchSearchPets } from "@/lib/services/search_pets";
import PetCard from "@/components/cards/PetCard";

type SearchParamsLike = {
  getAll: (key: string) => string[];
};

const readMulti = (sp: SearchParamsLike, key: string): string[] => {
  return Array.from(
    new Set(
      sp
        .getAll(key)
        .flatMap((v: string) => v.split(","))
        .map((v: string) => v.trim().toLowerCase())
        .filter((v: string) => Boolean(v)),
    ),
  );
};

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const filters = useMemo(
    () => ({
      species: readMulti(searchParams, "species"),
      sex: readMulti(searchParams, "sex"),
      age: readMulti(searchParams, "age"),
      size: readMulti(searchParams, "size"),
    }),
    [searchParams],
  );

  useEffect(() => {
    let alive = true;

    async function runSearch() {
      setLoading(true);
      try {
        const data = await fetchSearchPets(filters);
        if (alive) setPets(data ?? []);
      } finally {
        if (alive) setLoading(false);
      }
    }

    runSearch();
    return () => {
      alive = false;
    };
  }, [filters]);

  return (
    <div>
      {loading ? <div>Loading...</div> : null}
      {!loading && pets.length === 0 ? <div>No pets found.</div> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {pets.map((pet: any) => (
          <PetCard
            key={pet.id}
            href={`/site/profiles/pets/${pet.id}`}
            imageUrl={pet.photo_url}
            petName={pet.name}
            shelterLogo={pet.shelter?.logo_url}
            shelterName={pet.shelter?.shelter_name}
            sex={pet.sex}
          />
        ))}
      </div>
    </div>
  );
}
