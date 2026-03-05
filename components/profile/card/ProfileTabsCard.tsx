// components/profile/ProfileTabsCard.tsx
"use client";

import ProfileTabsCardUser from "./UserTopCard";
import ProfileTabsCardShelter from "./ShelterTopCard";

export type TabsKey = "videos" | "pets" | "shelters";
export type ViewerRole = "user" | "shelter";

type Props = { role: "user" } | { role: "shelter"; shelterId: string };

export default function ProfileTabsCard(props: Props) {
  if (props.role === "user") return <ProfileTabsCardUser />;
  return <ProfileTabsCardShelter shelterId={props.shelterId} />;
}
