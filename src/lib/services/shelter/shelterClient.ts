import type {
  ShelterProfile,
  ShelterUpdatePayload,
} from "@/src/lib/types/shelters";

class ShelterClient {
  private async parseJsonOrThrow(res: Response) {
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Shelter API error:", data);
      throw new Error(data?.details || data?.error || "Request failed.");
    }

    return data;
  }

  async fetchMyShelterProfile(): Promise<ShelterProfile> {
    const res = await fetch("/api/shelters/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const data = await this.parseJsonOrThrow(res);
    return data.data;
  }

  async patchMyShelterProfile(
    payload: ShelterUpdatePayload,
  ): Promise<ShelterProfile> {
    const res = await fetch("/api/shelters/me", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await this.parseJsonOrThrow(res);
    return data.data;
  }

  async uploadMyShelterAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/shelters/me/avatar", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await this.parseJsonOrThrow(res);
    return data.publicUrl;
  }
}

export const shelterClient = new ShelterClient();

// Backward-compatible exports
export async function fetchMyShelterProfile(): Promise<ShelterProfile> {
  return shelterClient.fetchMyShelterProfile();
}

export async function patchMyShelterProfile(
  payload: ShelterUpdatePayload,
): Promise<ShelterProfile> {
  return shelterClient.patchMyShelterProfile(payload);
}

export async function uploadMyShelterAvatar(file: File): Promise<string> {
  return shelterClient.uploadMyShelterAvatar(file);
}
