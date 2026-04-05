"use client";

import TopCard from "@/components/template/user/TopCard";
import ProfileSection from "@/components/template/ProfileSection";
import WebTemplate from "@/components/template/WebTemplate";

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
    <WebTemplate
      header={
        <TopCard
          title={shelter.shelter_name}
          subtitle={shelter.location ?? ""}
          imageUrl={shelter.logo_url}
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
