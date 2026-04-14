// app/site/home/pet/page.tsx
import HomeClient from "../../HomeClient";
import { requireShelter, requireAdmin } from "@/src/lib/utils/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SharedVideoPage({ params }: Props) {
  const { id } = await params;
  let isShelter = false;
  let isAdmin = false;

  try {
    await requireShelter();
    isShelter = true;
  } catch {
    isShelter = false;
  }

  try {
    await requireAdmin();
    isAdmin = true;
  } catch {
    isAdmin = false;
  }

  return (
    <HomeClient
      isShelter={isShelter}
      isAdmin={isAdmin}
      initialMediaId={id ?? null}
    />
  );
}
