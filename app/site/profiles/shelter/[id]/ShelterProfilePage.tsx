"use client";

import TopCard from "@/components/profile/user/UserShelterTopCard";
import ProfileSection from "@/components/profile/ProfileSection";
import ProfileTabsCard from "@/components/profile/ProfileTabsCard";
import ProfileShell from "@/components/profile/user/UserProfileTemplate";

import ShareButton from "@/components/ui/ShareButton";
import LikeButton from "@/components/ui/LikeButton";
import DonationModal from "@/components/modal/DonationModal";

type Pets = {
  id: string;
  name: string;
  sex: string;
  photo_url: string;
};
type ShelterUI = {
  id: string;
  shelter_name: string;
  location?: string | null;
  logo_url?: string | null;
  about?: string | null;
  contact?: string | null;
  created_at?: string | null;
  pets: Pets[];
};

export default function ShelterProfilePage({
  shelter,
}: {
  shelter: ShelterUI;
}) {
  return (
    <ProfileShell
      side={
        <>
          <ProfileSection title="Information">
            {shelter.about ?? "—"}
          </ProfileSection>
          <ProfileSection title="Contact">
            {shelter.contact ?? "—"}
          </ProfileSection>
          <ProfileTabsCard defaultTab="videos" />
        </>
      }
      main={
        <>
          <TopCard
            title={shelter.shelter_name}
            subtitle={shelter.location ?? ""}
            imageUrl={shelter.logo_url}
            actions={
              <>
                <DonationModal shelterId={shelter.id} />
                <ShareButton id={shelter.id} type="shelter" />
                <div className="scale-75 text-white font-semibold">
                  <LikeButton targetId={shelter.id} targetType="shelter" />
                  Like
                </div>
              </>
            }
            rightSlot={
              <div className="flex items-center gap-2">
                <button className="rounded-full border px-3 py-1 text-sm">
                  Edit
                </button>
              </div>
            }
          />
        </>
      }
    />
  );
}
