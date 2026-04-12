import { Suspense } from "react";
import HomeClient from "./HomeClient";
import { requireShelter, requireAdmin } from "@/src/lib/utils/auth";

export default async function Page() {
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
    <Suspense fallback={null}>
      <HomeClient isShelter={isShelter} isAdmin={isAdmin} />
    </Suspense>
  );
}
