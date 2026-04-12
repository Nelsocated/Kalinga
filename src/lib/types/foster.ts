export interface Fosters {
  id: string;
  pet_id: string;
  title: string;
  description: string;
  created_at?: string;
}

export type FosterRow = {
  id: string | number;
  pet_id: string | number;
  title: string | null;
  description: string | null;
  created_at?: string | null;
};

export type FosterItem = {
  id: string;
  pet_id: string;
  title: string;
  description: string;
  created_at: string;
};

export type CreateFosterInput = {
  petId: string;
  title: string;
  description: string;
  adoptionStatus?: "available" | "pending";
};

export type UpdateFosterInput = {
  id: string;
  title?: string;
  description?: string;
};

export type ServiceResult<T> = {
  ok: boolean;
  data: T | null;
  error: string | null;
  details?: string | null;
  status: number;
};
