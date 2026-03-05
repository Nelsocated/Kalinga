import { createClient } from "../supabase/client";

// Update this if your table/bucket names differ
const PROFILES_TABLE = "profiles";
const AVATAR_BUCKET = "avatars";

export type ProfileRow = {
  id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  contact: string | null;
  avatar_url: string | null;
  updated_at?: string | null;
};

export type ProfileUpdatePayload = {
  full_name?: string | null;
  username?: string | null;
  bio?: string | null;
  contact?: string | null;
  avatar_url?: string | null;
};

function supabase() {
  return createClient();
}

export async function getMyProfile(): Promise<ProfileRow | null> {
  const sb = supabase();

  const { data: auth, error: authErr } = await sb.auth.getUser();
  if (authErr) throw authErr;

  const userId = auth.user?.id;
  if (!userId) throw new Error("Not signed in.");

  const { data, error } = await sb
    .from(PROFILES_TABLE)
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  // If no profile row yet, create one (optional but super handy)
  if (!data) {
    const { error: insErr } = await sb
      .from(PROFILES_TABLE)
      .insert({ id: userId })
      .single();
    if (insErr) throw insErr;

    const { data: created, error: readErr } = await sb
      .from(PROFILES_TABLE)
      .select("*")
      .eq("id", userId)
      .single();
    if (readErr) throw readErr;

    return created as ProfileRow;
  }

  return data as ProfileRow;
}

export async function updateMyProfile(payload: ProfileUpdatePayload) {
  const sb = supabase();

  const { data: auth, error: authErr } = await sb.auth.getUser();
  if (authErr) throw authErr;

  const userId = auth.user?.id;
  if (!userId) throw new Error("Not signed in.");

  const { error } = await sb
    .from(PROFILES_TABLE)
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw error;
}

export async function uploadMyAvatar(file: File): Promise<string> {
  const sb = supabase();

  const { data: auth, error: authErr } = await sb.auth.getUser();
  if (authErr) throw authErr;

  const userId = auth.user?.id;
  if (!userId) throw new Error("Not signed in.");

  // Basic file checks
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }
  const ext = file.name.split(".").pop() || "png";
  const path = `${userId}/avatar.${ext}`;

  const { error: upErr } = await sb.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (upErr) throw upErr;

  const { data } = sb.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error("Failed to get public URL.");

  // Save into profile row too
  await updateMyProfile({ avatar_url: data.publicUrl });

  return data.publicUrl;
}
