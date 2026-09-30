import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import { ApiError } from "@/src/lib/api";
import type { Users, UserUpdatePayload } from "@/src/lib/types/users";

const PROFILES_TABLE = "users";
const AVATAR_BUCKET = "user_photos";

const USER_SELECT = `
  id,
  full_name,
  username,
  role,
  photo_url,
  bio,
  contact_email,
  contact_phone,
  updated_at,
  created_at
`;

export async function getUserById(userId: string): Promise<Users | null> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .select(USER_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return (data as Users | null) ?? null;
}

export async function getUsersByIds(ids: string[]): Promise<Users[]> {
  const unique = [...new Set(ids)].filter(Boolean);
  if (!unique.length) return [];

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .select(USER_SELECT)
    .in("id", unique);

  if (error) throw new Error(error.message);

  return (data ?? []) as Users[];
}

/** Returns the caller's profile row, creating it if it's missing. */
export async function getMyUser(userId: string): Promise<Users> {
  const existing = await getUserById(userId);
  if (existing) return existing;

  const supabase = await createServerSupabase();

  const { error: insertError } = await supabase
    .from(PROFILES_TABLE)
    .insert({ id: userId });

  if (insertError) throw new Error(insertError.message);

  const created = await getUserById(userId);

  if (!created) throw new Error("Failed to create user row.");

  return created;
}

/** `payload` must already be limited to the editable profile fields. */
export async function updateMyUser(
  userId: string,
  payload: UserUpdatePayload,
): Promise<Users> {
  await getMyUser(userId);

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .update(payload)
    .eq("id", userId)
    .select(USER_SELECT)
    .single();

  if (error) throw new Error(error.message);

  return data as Users;
}

export async function uploadMyAvatar(
  userId: string,
  file: File,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new ApiError(400, "Please upload an image file.");
  }

  const supabase = await createServerSupabase();

  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

  const { error: updateError } = await supabase
    .from(PROFILES_TABLE)
    .update({ photo_url: data.publicUrl })
    .eq("id", userId);

  if (updateError) throw new Error(updateError.message);

  return data.publicUrl;
}
