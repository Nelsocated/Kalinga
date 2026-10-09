import { Suspense } from "react";
import HomeClient from "./HomeClient";
import { getAuthUser } from "@/src/lib/utils/auth";

export default async function Page() {
  const user = await getAuthUser();
  const isShelter = user?.role === "shelter";
  const isAdmin = user?.role === "admin";

  return (
    <Suspense fallback={null}>
      <HomeClient isShelter={isShelter} isAdmin={isAdmin} />
    </Suspense>
  );
}
