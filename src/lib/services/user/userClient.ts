import type { UserUpdatePayload } from "@/src/lib/types/users";
import type { Users } from "@/src/lib/types/users";

type ApiResponse<T> = {
  data?: T;
  error?: string;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

export async function fetchMyUserProfile(): Promise<Users> {
  const res = await fetch("/api/users", {
    cache: "no-store",
    credentials: "include",
  });

  const json = (await res
    .json()
    .catch(() => null)) as ApiResponse<Users> | null;

  if (!res.ok) {
    throw new Error(json?.error ?? "Failed to load profile.");
  }

  if (!json?.data) {
    throw new Error("Invalid profile response.");
  }

  return json.data;
}

export async function patchMyUserProfile(
  payload: UserUpdatePayload,
): Promise<Users> {
  const res = await fetch("/api/users", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = (await res
    .json()
    .catch(() => null)) as ApiResponse<Users> | null;

  if (!res.ok) {
    throw new Error(json?.error ?? "Failed to save profile.");
  }

  if (!json?.data) {
    throw new Error("Invalid profile update response.");
  }

  return json.data;
}

export async function uploadMyUserAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/users/avatar", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const json = (await res.json().catch(() => null)) as ApiResponse<{
    photo_url: string;
  }> | null;

  if (!res.ok) {
    throw new Error(json?.error ?? "Failed to upload picture.");
  }

  const photoUrl = json?.data?.photo_url;

  if (!photoUrl) {
    throw new Error("Invalid avatar upload response.");
  }

  return photoUrl;
}

export { getErrorMessage };
