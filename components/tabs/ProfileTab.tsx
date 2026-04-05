// components/profile/ProfileTabsCard.tsx

import UserTab from "./UserTab";
import ShelterTab from "./ShelterTab";
import {
  getShelterPostedVideos,
  getShelterPostedPets,
} from "@/lib/services/shelter/shelterService";

export type TabsKey = "videos" | "pets" | "shelters";
export type ViewerRole = "user" | "shelter";

type Props = { role: "user" } | { role: "shelter"; shelterId: string };

export default async function ProfileTabs(props: Props) {
  if (props.role === "user") return <UserTab />;

  const [initialVideos, initialPets] = await Promise.all([
    getShelterPostedVideos(props.shelterId),
    getShelterPostedPets(props.shelterId),
  ]);

  return (
    <ShelterTab
      shelterId={props.shelterId}
      initialVideos={initialVideos}
      initialPets={initialPets}
    />
  );
}
