import { Suspense } from "react";
import HomeClient from "./HomeClient";
import { requireShelter } from "@/lib/utils/auth";

export default async function Page() {
  let isShelter = false;

  try {
    await requireShelter();
    isShelter = true;
  } catch {
    isShelter = false;
  }

  return (
    <Suspense fallback={null}>
      <HomeClient isShelter={isShelter} />
    </Suspense>
  );
}
