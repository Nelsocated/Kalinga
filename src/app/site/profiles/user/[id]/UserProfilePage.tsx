"use client";

import Link from "next/link";
import { Bell, Gear } from "@phosphor-icons/react";
import UserEditProfileModal from "@/src/components/modal/EditProfile/UserEditProfile";
import TopCard from "@/src/components/template/user/TopCard";
import ProfileSection from "@/src/components/template/ProfileSection";
import MoreSheet from "@/src/components/layout/MoreSheet";
import WebTemplate from "@/src/components/template/WebTemplate";
import { buttonStyles } from "@/src/components/ui/Button";

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

const iconLink = buttonStyles({ variant: "ghost", size: "icon", className: "md:hidden" });

export default function UserProfilePage({
  user,
  isOwner,
  tabs,
}: {
  user: UserUI;
  isOwner: boolean;
  tabs: React.ReactNode;
}) {
  return (
    <WebTemplate
      header={
        <TopCard
          title={user.full_name}
          subtitle={`@${user.username}`}
          imageUrl={user.avatar_url}
          rightSlot={
            // Editing and account links are only for the profile's owner
            isOwner ? (
              <div className="flex items-center gap-1">
                <UserEditProfileModal />
                {/* The sidebar holds these from md; phones reach them here */}
                <Link href="/site/notification" aria-label="Notifications" className={iconLink}>
                  <Bell aria-hidden="true" />
                </Link>
                <Link href="/site/settings" aria-label="Settings" className={iconLink}>
                  <Gear aria-hidden="true" />
                </Link>
                <MoreSheet />
              </div>
            ) : null
          }
        />
      }
      main={
        <div className="flex flex-col">
          <div className="grid gap-x-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <ProfileSection title="Bio">
              <p className="max-w-[65ch] whitespace-pre-line">{user.bio || "No bio yet."}</p>
            </ProfileSection>
            {user.contact ? <ProfileSection title="Contact">{user.contact}</ProfileSection> : null}
          </div>
          {tabs ? <div className="pt-8">{tabs}</div> : null}
        </div>
      }
    />
  );
}
