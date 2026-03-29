"use client";

import EditProfileModal from "@/components/modal/EditProfileModal";
import Topcard from "@/components/template/user/TopCard";
import ProfileSection from "@/components/template/ProfileSection";
import WebTemplate from "@/components/template/WebTemplate";

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
    <WebTemplate
      header={
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
