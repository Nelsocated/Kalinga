"use client";

import EditProfileModal from "@/components/modal/EditProfileModal";
import Topcard from "@/components/profile/user/TopCard";
import ProfileSection from "@/components/profile/ProfileSection";
import ProfileTemplate from "@/components/profile/user/ProfileTemplate";

type UserUI = {
  id: string;
  full_name: string;
  username: string;
  location?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  contact?: string | null;
  created_at?: string | null;
};

export default function UserProfilePage({
  user,
  tabs,
}: {
  user: UserUI;
  tabs: React.ReactNode;
}) {
  return (
    <ProfileTemplate
      side={
        <>
          <ProfileSection title="Bio">{user.bio ?? "—"}</ProfileSection>
          <ProfileSection title="Contact">{user.contact ?? "—"}</ProfileSection>
          {tabs}
        </>
      }
      main={
        <>
          <Topcard
            title={user.full_name}
            subtitle={`@${user.username}`}
            location={user.location ?? ""}
            imageUrl={user.avatar_url}
            rightSlot={<EditProfileModal />}
          />
        </>
      }
    />
  );
}
