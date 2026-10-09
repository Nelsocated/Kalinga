import type { Tables } from "@/src/lib/supabase/database.types";

export type Pet_Media = Tables<"pet_media">;

type PetMini = {
  id: string;
  name: string | null;
  photo_url: string | null;
};

export type VideoWithPet = {
  id: string;
  pet_id: string;
  type: "photo" | "video";
  url: string | null;
  caption: string | null;
  created_at: string;
  pet: PetMini | null;
};

export type VideoWithShelterPet = {
  id: string;
  pet_id: string;
  type: "photo" | "video";
  url: string | null;
  caption: string | null;
  created_at: string;
  pets: PetMini | null;
};

export type VideoRow = {
  id: string;
  pet_id: string;
  type: "photo" | "video";
  url: string | null;
  caption: string | null;
  created_at: string;
  pets: PetMini | PetMini[] | null;
};

export type CreateVideoInput = {
  petId: string;
  caption?: string | null;
  file: File;
};

export type UploadPetPhotoInput = {
  file: File;
  petId: string;
};
