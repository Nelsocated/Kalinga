"use client";

import type React from "react";
import { SquaresFour } from "@phosphor-icons/react";
import ProfileHero from "@/src/components/template/ProfileHero";
import ProfileSection from "@/src/components/template/ProfileSection";
import MoreSheet from "@/src/components/layout/MoreSheet";
import WebTemplate from "@/src/components/template/WebTemplate";
import ContactRows from "@/src/components/template/ContactRows";
import ShelterEditProfileModal from "@/src/components/modal/EditProfile/ShelterEditProfile";
import { LinkButton } from "@/src/components/ui/Button";
import type { ShelterProfileUI } from "@/src/lib/types/shelters";

type ShelterProfileClientProps = {
  shelter: ShelterProfileUI;
  tabs: React.ReactNode;
};

/** The shelter's own profile: same layout as the public one, with edit and dashboard. */
export default function ShelterProfileClient({ shelter, tabs }: ShelterProfileClientProps) {
  return (
    <WebTemplate
      main={
        <div className="flex flex-col">
          <ProfileHero
            name={shelter.shelter_name}
            subtitle={shelter.location}
            imageUrl={shelter.logo_url}
            actions={
              <>
                <ShelterEditProfileModal />
                <LinkButton href="/shelter/dashboard" variant="secondary" icon={<SquaresFour aria-hidden="true" />}>
                  Dashboard
                </LinkButton>
              </>
            }
            utilities={<MoreSheet />}
          />
          <div className="grid gap-x-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <ProfileSection title="About">
              <p className="max-w-[65ch] whitespace-pre-line">
                {shelter.about || "Add an introduction so adopters know who you are."}
              </p>
            </ProfileSection>
            <ProfileSection title="Contact">
              <ContactRows
                email={shelter.contact_email}
                phone={shelter.contact_phone}
                emptyText="Add an email or phone number so adopters can reach you."
              />
            </ProfileSection>
          </div>
          <div className="pt-8">{tabs}</div>
        </div>
      }
    />
  );
}
