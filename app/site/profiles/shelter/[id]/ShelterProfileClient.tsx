"use client";

import TopCard from "@/components/profile/user/TopCard";
import ProfileSection from "@/components/profile/ProfileSection";
import ProfileTemplate from "@/components/profile/user/ProfileTemplate";

import ShareButton from "@/components/ui/ShareButton";
import LikeButton from "@/components/ui/LikeButton";
import DonationModal from "@/components/modal/DonationModal";
import React from "react";

type ShelterPetUI = {
  id: string;
  name: string;
  sex: string;
  photo_url: string | null;
};

export type ShelterProfileUI = {
  id: string;
  shelter_name: string;
  location?: string | null;
  logo_url?: string | null;
  about?: string | null;
  contact?: string | null;
  created_at?: string | null;
  pets: ShelterPetUI[];
};

type ShelterProfileClientProps = {
  shelter: ShelterProfileUI;
  tabs: React.ReactNode;
};

export default function ShelterProfileClient({
  shelter,
  tabs,
}: ShelterProfileClientProps) {
  return (
    <ProfileTemplate
      side={
        <>
          <ProfileSection title="Information">
            {shelter.about ?? "—"}
          </ProfileSection>

          <ProfileSection title="Contact">
            {shelter.contact ?? "—"}
          </ProfileSection>

          {tabs}
        </>
      }
      main={
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

              <div className="flex flex-col items-center font-semibold leading-none text-white">
                <ShareButton id={shelter.id} type="shelter" />
                <span className="m-1 text-xs">Share</span>
              </div>

              <div className="flex flex-col items-center font-semibold leading-none text-white">
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
      }
    />
  );
}
