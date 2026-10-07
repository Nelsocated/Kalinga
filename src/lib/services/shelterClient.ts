import { fetchJson } from "@/src/lib/fetchJson";
import { unwrap } from "@/src/lib/actionResult";
import {
  getMyDonationSettingsAction,
  saveMyDonationSettingsAction,
  updateMyShelterAction,
} from "@/src/app/actions/profile";
import type { DonationSettings } from "@/src/lib/types/donation";
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

export async function fetchMyDonationSettings(): Promise<DonationSettings> {
  return unwrap(await getMyDonationSettingsAction());
}

export async function saveMyDonationSettings(
  settings: DonationSettings,
): Promise<DonationSettings> {
  return unwrap(await saveMyDonationSettingsAction(settings));
}

export async function uploadMyDonationQr(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const json = await fetchJson<{ data: { publicUrl: string } }>(
    "/api/shelters/me/donation-qr",
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  return json.data.publicUrl;
}
