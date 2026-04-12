import "server-only";
import { createClientSupabase } from "@/src/lib/supabase/client";
import { createServerSupabase } from "@/src/lib/supabase/server";
import type { Users } from "@/src/lib/types/users";
import type { UserUpdatePayload } from "@/src/lib/types/users";

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

async function requireCurrentUser() {
  const supabase = await createClientSupabase();

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  const userId = data.user?.id;

  if (!userId) {
    throw new Error("Not signed in.");
  }

  return { supabase, userId };
}

async function getUserByIdWithSupabase(
  userId: string,
  supabase: Awaited<ReturnType<typeof createClientSupabase>>,
): Promise<Users | null> {
  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .select(USER_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return (data as Users | null) ?? null;
}

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

export async function getMyUser(userId: string): Promise<Users> {
  const supabase = await createServerSupabase();

  const existing = await getUserByIdWithSupabase(userId, supabase);

  if (existing) {
    return existing;
  }

  const { error: insertError } = await supabase
    .from(PROFILES_TABLE)
    .insert({ id: userId });

  if (insertError) throw new Error(insertError.message);

  const created = await getUserByIdWithSupabase(userId, supabase);

  if (!created) {
    throw new Error("Failed to create user row.");
  }

  return created;
}

export async function updateMyUser(
  userId: string,
  payload: UserUpdatePayload,
): Promise<Users> {
  const supabase = await createServerSupabase();

  const existing = await getUserByIdWithSupabase(userId, supabase);

  if (!existing) {
    const { error: insertError } = await supabase
      .from(PROFILES_TABLE)
      .insert({ id: userId });

    if (insertError) throw new Error(insertError.message);
  }

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .update(payload)
    .eq("id", userId)
    .select(USER_SELECT)
    .single();

  if (error) throw new Error(error.message);

  return data as Users;
}

export async function uploadMyAvatar(file: File): Promise<string> {
  const { supabase, userId } = await requireCurrentUser();

  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }

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

  const publicUrl = data.publicUrl;

  if (!publicUrl) {
    throw new Error("Failed to get avatar URL.");
  }

  await supabase
    .from(PROFILES_TABLE)
    .update({ photo_url: publicUrl })
    .eq("id", userId);

  return publicUrl;
}
