import { notFound } from "next/navigation";
import UserProfilePage from "./UserProfilePage";
import { headers } from "next/headers";

async function getUserProfileAPI(id: string) {
  const h = await headers();

  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocol =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");

  if (!host) throw new Error("Missing host header.");

  const res = await fetch(`${protocol}://${host}/api/profiles/users/${id}`, {
    cache: "no-store",
    headers: {
      // forward auth/session cookies to API route
      cookie: h.get("cookie") ?? "",
    },
  });

  const body = await res.json().catch(() => ({}));

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(body?.error ?? `Request failed: ${res.status}`);

  return body?.data ?? null;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getUserProfileAPI(id);
  if (!data) return notFound();

  const user = {
    id: data.id,
    full_name: data.full_name,
    username: data.username,
    avatar_url: data.photo_url ?? null,
    bio: data.bio ?? null,
    contact:
      [data.contact_email, data.contact_phone].filter(Boolean).join(" • ") ||
      null,
    location: null,
    created_at: data.created_at,
  };

  return <UserProfilePage user={user} />;
}
