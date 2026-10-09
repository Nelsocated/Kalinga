import type { Tables } from "@/src/lib/supabase/database.types";

export interface Pets {
  id: string;
  shelter_id: string;
  pet_name: string;
  description: string;
  breed: string;
  age: "kitten/puppy" | "young_adult" | "adult" | "senior";
  status: "available" | "pending" | "adopted";
  sex: "male" | "female";
  species: "dog" | "cat";
  size: "small" | "medium" | "large";
  vaccinated: boolean;
  spayed_neutered: boolean;
  photo_url: string;
  years_inShelter: number;
  created_at: string;
}

export type SearchPetCardItem = Pets & {
  shelter: {
    id: string;
    shelter_name: string | null;
    logo_url: string | null;
  } | null;
};

export type Multi<T extends string> = T | T[];

export type PetRow = Tables<"pets">;

export interface PetFilters {
  species?: Multi<Pets["species"]>;
  sex?: Multi<Pets["sex"]>;
  age?: Multi<Pets["age"]>;
  size?: Multi<Pets["size"]>;
  status?: Multi<Pets["status"]>;
  /** Free text matched against name and breed. */
  q?: string;
}

export type Dashboard = {
  id: string;
  name: string | null;
  photo_url: string | null;
  species: string | null;
};

export type CreatePetInput = {
  shelter_id: string;
  name: string;

  description?: string | null;
  breed?: string | null;

  age: "kitten/puppy" | "young_adult" | "adult" | "senior";
  sex: "male" | "female";
  species: "dog" | "cat";
  size: "small" | "medium" | "large";

  status?: "available" | "pending" | "adopted";

  vaccinated?: boolean;
  spayed_neutered?: boolean;

  photo_url?: string | null;
  /** The year the pet arrived at the shelter, e.g. 2021. */
  year_inShelter?: number | null;
};
