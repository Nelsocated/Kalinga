import { fetchJson } from "@/src/lib/fetchJson";
import { unwrap } from "@/src/lib/actionResult";
import { updateMyUserAction } from "@/src/app/actions/profile";
import type { Users, UserUpdatePayload } from "@/src/lib/types/users";

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export async function fetchMyUserProfile(): Promise<Users> {
  const json = await fetchJson<{ data?: Users }>("/api/users", {
    cache: "no-store",
    credentials: "include",
  });

  if (!json.data) throw new Error("Invalid profile response.");

  return json.data;
}

export async function patchMyUserProfile(
  payload: UserUpdatePayload,
): Promise<Users> {
  return unwrap(await updateMyUserAction(payload));
}

export async function uploadMyUserAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const json = await fetchJson<{ data?: { photo_url: string } }>(
    "/api/users/avatar",
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  if (!json.data?.photo_url) throw new Error("Invalid avatar upload response.");

  return json.data.photo_url;
}
