"use client";

import type React from "react";
import TopCard from "@/src/components/template/user/TopCard";
import ProfileSection from "@/src/components/template/ProfileSection";
import WebTemplate from "@/src/components/template/WebTemplate";
import LikeButton from "@/src/components/ui/LikeButton";
import DonationModal from "@/src/components/modal/DonationModal";
import ShareButton from "@/src/components/ui/ShareButton";

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

export default function ShelterProfileClient({ shelter, tabs }: ShelterProfileClientProps) {
  return (
    <WebTemplate
      header={
        <TopCard
          title={shelter.shelter_name}
          subtitle={shelter.location ?? ""}
          imageUrl={shelter.logo_url}
          actions={
            <div className="flex items-center gap-2">
              <DonationModal shelterId={shelter.id} buttonClassName="h-12" />
              <ShareButton id={shelter.id} type="shelter" variant="outlined" />
              <LikeButton targetId={shelter.id} targetType="shelter" variant="outlined" />
            </div>
          }
        />
      }
      main={
        <div className="flex flex-col">
          <div className="grid gap-x-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <ProfileSection title="About">
              <p className="max-w-[65ch] whitespace-pre-line">
                {shelter.about || "This shelter hasn't written an introduction yet."}
              </p>
            </ProfileSection>
            <ProfileSection title="Contact">{shelter.contact}</ProfileSection>
          </div>
          <div className="pt-8">{tabs}</div>
        </div>
      }
    />
  );
}
