import { fetchJson } from "@/src/lib/fetchJson";
import { unwrap } from "@/src/lib/actionResult";
import { updateMyShelterAction } from "@/src/app/actions/profile";
import type {
  ShelterProfile,
  ShelterUpdatePayload,
} from "@/src/lib/types/shelters";

export async function fetchMyShelterProfile(): Promise<ShelterProfile> {
  const json = await fetchJson<{ data: ShelterProfile }>("/api/shelters/me", {
    credentials: "include",
    cache: "no-store",
  });

  return json.data;
}

export async function patchMyShelterProfile(
  payload: ShelterUpdatePayload,
): Promise<ShelterProfile> {
  return unwrap(await updateMyShelterAction(payload));
}

export async function uploadMyShelterAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const json = await fetchJson<{ data: { publicUrl: string } }>(
    "/api/shelters/me/avatar",
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  return json.data.publicUrl;
}
