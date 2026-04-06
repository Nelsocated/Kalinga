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

export type PetRow = {
  id: string | null;
  shelter_id: string | null;
  name?: string | null;
  pet_name?: string | null;
  description: string | null;
  breed: string | null;
  age: string | null;
  status: string | null;
  sex: string | null;
  species: string | null;
  size: string | null;
  vaccinated: boolean | null;
  spayed_neutered: boolean | null;
  photo_url: string | null;
  year_inShelter?: number | string | null;
  yearInShelter?: number | string | null;
  year_in_shelter?: number | string | null;
  created_at: string | null;
};

export interface PetFilters {
  species?: Multi<Pets["species"]>;
  sex?: Multi<Pets["sex"]>;
  age?: Multi<Pets["age"]>;
  size?: Multi<Pets["size"]>;
  status?: Multi<Pets["status"]>;
}

export interface IPetService {
  getPets(filters?: PetFilters): Promise<Pets[]>;
  getPetById(id: string): Promise<Pets | null>;
  getPetsByIds(ids: string[]): Promise<Pets[]>;
  getPetsByShelter(shelterId: string): Promise<Pets[]>;
  getLongestStayPets(limit?: number): Promise<Pets[]>;
  getAvailablePets(filters?: Omit<PetFilters, "status">): Promise<Pets[]>;
  fetchSearchPets(filters?: Omit<PetFilters, "status">): Promise<Pets[]>;
}

export type Dashboard = {
  id: string;
  name: string | null;
  photo_url: string | null;
  species: string;
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
  years_inShelter?: number | null;
};
