import type {
  PetStatus,
  answer,
  PetStatusFull,
} from "@/src/lib/types/adoptionRequests";

export type AdoptionFormPayload = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  reason: string;
  confirm_safe: boolean;
  confirm_allergies: boolean;
  confirm_food: boolean;
  confirm_attention: boolean;
  confirm_vet: boolean;
};

type AdoptionStatusResponse = {
  data: {
    id: string;
    status: PetStatus;
  };
};

type ErrorResponse = {
  error?: string;
};

export async function fetchPetAdoptionStatus(
  petId: string,
): Promise<AdoptionStatusResponse["data"]> {
  const res = await fetch(`/api/pets/${encodeURIComponent(petId)}/adoption`, {
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as
    | AdoptionStatusResponse
    | ErrorResponse
    | null;

  if (!res.ok) {
    throw new Error(
      json && "error" in json
        ? (json.error ?? "Failed to fetch pet adoption status.")
        : "Failed to fetch pet adoption status.",
    );
  }

  if (!json || !("data" in json) || !json.data) {
    throw new Error("Invalid adoption status response.");
  }

  return json.data;
}

export async function createPetAdoptionRequest(
  petId: string,
  payload: AdoptionFormPayload,
): Promise<void> {
  const res = await fetch(`/api/pets/${encodeURIComponent(petId)}/adoption`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = (await res.json().catch(() => null)) as {
    data?: unknown;
    error?: string;
  } | null;

  if (!res.ok) {
    throw new Error(json?.error ?? "Failed to create adoption request.");
  }
}

async function parseJsonOrThrow(res: Response) {
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error ?? `Request failed (${res.status})`);
  }

  return json;
}

export async function fetchAdoptionAnswer(answerId: string): Promise<answer> {
  const res = await fetch(`/api/users/${answerId}/adoption/answer`, {
    method: "GET",
    cache: "no-store",
  });

  const json = await parseJsonOrThrow(res);

  if (!json?.data) {
    throw new Error("Answer not found.");
  }

  return json.data as answer;
}

export async function getPetStatus(petId: string): Promise<PetStatusFull> {
  if (!petId?.trim()) return null;

  const res = await fetch(`/api/pets/${petId}/status`, {
    method: "GET",
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error ?? `Request failed (${res.status})`);
  }

  return (json?.data?.status as PetStatusFull) ?? null;
}
