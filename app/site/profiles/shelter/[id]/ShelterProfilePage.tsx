"use client";

import TopCard from "@/components/profile/user/UserShelterTopCard";
import ProfileSection from "@/components/profile/ProfileSection";
import ProfileTabsCard from "@/components/profile/card/ProfileTabsCard";
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
          <ProfileTabsCard role="shelter" shelterId={shelter.id} />
        </>
      }
      main={
        <>
          <TopCard
            title={shelter.shelter_name}
            subtitle={shelter.location ?? ""}
            imageUrl={shelter.logo_url}
            actions={
              <div className="relative inline-flex w-fit items-center">
                <div className="flex flex-col items-center font-semibold leading-none">
                  <DonationModal shelterId={shelter.id} />
                  <span className="mb-1 text-xs text-white">Donate</span>
                </div>

                <div className="flex flex-col items-center text-white font-semibold leading-none">
                  <ShareButton id={shelter.id} type="shelter" />
                  <span className="m-1 text-xs">Share</span>
                </div>

                <div className="flex flex-col items-center text-white font-semibold leading-none">
                  <LikeButton
                    targetId={shelter.id}
                    targetType="shelter"
                    className="h-10 text-white"
                  />
                  <span className="text-xs">Like</span>
                </div>
              </div>
            }
          />
        </>
      }
    />
  );
}
