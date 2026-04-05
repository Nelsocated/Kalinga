"use client";

import TopCard from "@/components/template/user/TopCard";
import ProfileSection from "@/components/template/ProfileSection";
import WebTemplate from "@/components/template/WebTemplate";

import RightSlot from "@/components/template/user/RightSlot";
import EditProfileModal from "@/components/modal/EditProfile/ShelterEditProfile";
import DashboardButton from "../../components/buttons/DashboardButton";
import React from "react";

export type ShelterPetUI = {
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
  contact_email?: string | null;
  contact_phone?: string | null;
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
            <RightSlot>
              <div className="flex gap-3">
                <EditProfileModal />
                <DashboardButton />
              </div>
            </RightSlot>
          }
        />
      }
      main={
        <>
          <ProfileSection title="Information">
            {shelter.about ?? "—"}
          </ProfileSection>

          <ProfileSection title="Contact" className="leading-5">
            <div>{shelter.contact_email}</div>
            <div>{shelter.contact_phone}</div>
          </ProfileSection>

          {tabs}
        </>
      }
    />
  );
}
