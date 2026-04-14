"use client";

import TopCard from "@/src/components/template/user/TopCard";
import ProfileSection from "@/src/components/template/ProfileSection";
import WebTemplate from "@/src/components/template/WebTemplate";
import LikeButton from "@/src/components/ui/LikeButton";
import DonationModal from "@/src/components/modal/DonationModal";
import ShareButton from "@/src/components/ui/ShareButton";
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
  contact?: React.ReactNode | null;
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
    <WebTemplate
      header={
        <TopCard
          title={shelter.shelter_name}
          subtitle={shelter.location ?? ""}
          imageUrl={shelter.logo_url}
          actions={
            <div className="flex gap-3">
              <DonationModal shelterId={shelter.id} />
              <ShareButton id={shelter.id} type="shelter" />
              <LikeButton
                targetId={shelter.id}
                targetType="shelter"
                className="text-primary h-10"
              />
            </div>
          }
        />
      }
      main={
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
    />
  );
}
