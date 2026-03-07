import { notFound } from "next/navigation";
import ShelterProfilePage from "./ShelterProfilePage";
import { headers } from "next/headers";

async function getShelterProfileFromApi(id: string) {
  const h = await headers();

  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocol =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");

  if (!host) throw new Error("Missing host header.");

  const res = await fetch(`${protocol}://${host}/api/profiles/shelters/${id}`, {
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

  const data = await getShelterProfileFromApi(id).catch(() => null);
  if (!data) return notFound();

  const shelter = {
    id: data.id,
    shelter_name: data.shelter_name,
    logo_url: data.logo_url ?? null,
    location: data.location ?? null,
    about: data.about ?? null,
    contact:
      [data.contact_email, data.contact_phone].filter(Boolean).join(" • ") ||
      null,
    created_at: data.created_at,
    pets:
      data.pets?.map((pet: any) => ({
        id: pet.id,
        name: pet.name,
        sex: pet.sex,
        photo_url: pet.photo_url ?? null,
      })) ?? [],
  };

  return <ShelterProfilePage shelter={shelter} />;
}
