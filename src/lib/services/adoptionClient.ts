import { fetchJson } from "@/src/lib/fetchJson";
import type { PetStatus, answer } from "@/src/lib/types/adoptionRequests";

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

export async function fetchPetAdoptionStatus(
  petId: string,
): Promise<{ id: string; status: PetStatus }> {
  const json = await fetchJson<{ data?: { id: string; status: PetStatus } }>(
    `/api/pets/${encodeURIComponent(petId)}/adoption`,
    { cache: "no-store" },
  );

  if (!json.data) throw new Error("Invalid adoption status response.");

  return json.data;
}

export async function createPetAdoptionRequest(
  petId: string,
  payload: AdoptionFormPayload,
): Promise<void> {
  await fetchJson(`/api/pets/${encodeURIComponent(petId)}/adoption`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** `answerId` is the adoption request id. */
export async function fetchAdoptionAnswer(answerId: string): Promise<answer> {
  const json = await fetchJson<{ data?: answer }>(
    `/api/users/${encodeURIComponent(answerId)}/adoption/answer`,
    { cache: "no-store" },
  );

  if (!json.data) throw new Error("Answer not found.");

  return json.data;
}
