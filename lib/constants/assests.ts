// lib/constants/assets.ts

export const DEFAULT_AVATAR_URL =
  "https://vgfbwhjnmhpzxqybempj.supabase.co/storage/v1/object/public/user_photos/svgviewer-output.svg";

export function withDefaultAvatar(url?: string | null) {
  const clean = (url ?? "").trim();
  return clean.length ? clean : DEFAULT_AVATAR_URL;
}
