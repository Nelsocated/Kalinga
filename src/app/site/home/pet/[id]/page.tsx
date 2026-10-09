import HomeClient from "../../HomeClient";
import { getAuthUser } from "@/src/lib/utils/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SharedVideoPage({ params }: Props) {
  const { id } = await params;
  const user = await getAuthUser();
  const isShelter = user?.role === "shelter";
  const isAdmin = user?.role === "admin";

  return (
    <HomeClient
      isShelter={isShelter}
      isAdmin={isAdmin}
      initialMediaId={id ?? null}
    />
  );
}
