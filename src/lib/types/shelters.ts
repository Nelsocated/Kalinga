import type { Tables } from "@/src/lib/supabase/database.types";

export type Shelters = Tables<"shelter">;

export interface ShelterListItem {
  id: string;
  shelter_name: string | null;
  logo_url: string | null;
  location: string | null;
  total_available_pets: number;
  total_adopted_pets: number;
}

export interface ShelterVideoMini {
  id: string;
  href?: string;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  title?: string | null;
  caption?: string | null;
  petId: string;
  petName?: string | null;
  subtitle?: string | null;
}

export type PetGender = "male" | "female" | "unknown";
export interface ShelterPetMini {
  id: string;
  href?: string;
  imageUrl?: string | null;
  petName?: string | null;
  gender: PetGender;
  shelterName?: string | null;
  shelterLogo?: string | null;
}

export type ShelterRow = Pick<Tables<"shelter">, "id" | "shelter_name" | "logo_url" | "location">;

export type ShelterProfile = {
  id: string;
  owner_id: string | null;
  shelter_name: string | null;
  logo_url: string | null;
  photo_url?: string | null;
  about: string | null;
  location: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at?: string | null;
};

export type ShelterUpdatePayload = {
  shelter_name?: string;
  logo_url?: string;
  photo_url?: string;
  about?: string;
  location?: string;
  contact_email?: string;
  contact_phone?: string;
};

export type PetCardProps = ShelterPetMini & {
  breed?: string | null;
  age: "kitten/puppy" | "young_adult" | "adult" | "senior";
  sex: "male" | "female";
  species: "dog" | "cat";
  size: "small" | "medium" | "large";
};

/** The signed-in shelter's own profile page. */
export type ShelterPetUI = {
  id: string;
  name: string;
  sex: string;
  photo_url: string | null;
};

export type ShelterProfileUI = {
  id: string;
  shelter_name: string;
  location?: string | null;
  logo_url?: string | null;
  about?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  created_at?: string | null;
  pets: ShelterPetUI[];
};
