export interface Pets {
  id: string;
  shelter_id: string;
  pet_name: string;
  description: string;
  breed: string;
  age: "kitten/puppy" | "young_adult" | "adult" | "senior";
  personality: string;
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
