export interface Pet_Media {
  id: string;
  pet_id: string;
  type: "photo" | "video";
  url: string;
  caption?: string;
  created_at: string;
}

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
  title?: string | null;
  file: File;
};

export type ServiceResult<T> = {
  ok: boolean;
  status: number;
  message?: string;
  error?: string;
  details?: unknown;
  data?: T;
};
