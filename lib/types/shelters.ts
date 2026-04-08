export interface Shelters {
  id: string;
  owner_id: string;
  shelter_name: string;
  logo_url: string;
  about: string;
  location: string;
  contact_email: string;
  contact_phone: string;
  photo_url: string;
  cert_url: string;
  id_url: string;
  lease_url: string;
  created_at: string;
}

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

export interface ShelterRow {
  id: string;
  shelter_name: string | null;
  logo_url: string | null;
  location: string | null;
}

export interface PetStatusRow {
  shelter_id: string;
  status: string | null;
}

export type ShelterProfile = {
  id: string;
  owner_id: string;
  shelter_name: string | null;
  logo_url: string | null;
  photo_url?: string | null;
  about: string | null;
  location: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  cert_url?: string | null;
  id_url?: string | null;
  lease_url?: string | null;
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

type ShelterServiceSuccess = {
  ok: true;
  data: ShelterProfile;
  status: number;
};

type ShelterServiceError = {
  ok: false;
  error: string;
  details?: string | null;
  status: number;
};

export type ShelterServiceResult = ShelterServiceSuccess | ShelterServiceError;

export type PetCardProps = ShelterPetMini & {
  breed?: string | null;
  age: "kitten/puppy" | "young_adult" | "adult" | "senior";
  sex: "male" | "female";
  species: "dog" | "cat";
  size: "small" | "medium" | "large";
};
