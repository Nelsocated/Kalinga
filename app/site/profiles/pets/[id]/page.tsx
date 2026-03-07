import { notFound } from "next/navigation";
import { headers } from "next/headers";
import PetProfileClient from "./PetProfileClient";

async function getPetProfileAPI(id: string) {
  const h = await headers();

  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocol =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");

  if (!host) throw new Error("Missing host header.");

  const res = await fetch(`${protocol}://${host}/api/profiles/pets/${id}`, {
    cache: "no-store",
    headers: {
      cookie: h.get("cookie") ?? "",
    },
  });

  const body = await res.json().catch(() => ({}));

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(body?.error ?? `Request failed: ${res.status}`);

  // supports either { data } or raw object response
  return body?.data ?? body ?? null;
}

export default async function PetProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pet = await getPetProfileAPI(id);
  if (!pet) return notFound();

  return <PetProfileClient id={id} initialPet={pet} />;
}
