"use client";

import UserEditProfileModal from "@/src/components/modal/EditProfile/UserEditProfile";
import TopCard from "@/src/components/template/user/TopCard";
import ProfileSection from "@/src/components/template/ProfileSection";
import WebTemplate from "@/src/components/template/WebTemplate";

type UserUI = {
  id: string;
  full_name: string;
  username: string;
  location?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  contact?: React.ReactNode | null;
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
    <WebTemplate
      header={
        <>
          <TopCard
            title={user.full_name}
            subtitle={`@${user.username}`}
            location={user.location ?? ""}
            imageUrl={user.avatar_url}
            rightSlot={<UserEditProfileModal />}
          />
        </>
      }
      main={
        <>
          <ProfileSection title="Bio">{user.bio ?? "—"}</ProfileSection>
          <ProfileSection title="Contact">{user.contact ?? "—"}</ProfileSection>
          {tabs}
        </>
      }
    />
  );
}
