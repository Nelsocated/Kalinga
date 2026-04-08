"use client";

import { useRouter } from "next/navigation";
import EditProfileModalBase from "./EditProfileModal";
import {
  fetchMyShelterProfile,
  patchMyShelterProfile,
  uploadMyShelterAvatar,
} from "@/lib/services/shelter/shelterClient";

export default function ShelterEditProfileModal() {
  const router = useRouter();

  return (
    <EditProfileModalBase
      title="Edit Profile"
      fields={[
        { key: "shelter_name", label: "Shelter Name" },
        { key: "about", label: "About" },
        { key: "location", label: "Location" },
        { key: "contact_email", label: "Email", type: "email" },
        { key: "contact_phone", label: "Phone" },
      ]}
      loadProfile={async () => {
        const shelter = await fetchMyShelterProfile();

        return {
          avatarUrl: shelter.logo_url ?? "",
          shelter_name: shelter.shelter_name ?? "",
          about: shelter.about ?? "",
          location: shelter.location ?? "",
          contact_email: shelter.contact_email ?? "",
          contact_phone: shelter.contact_phone ?? "",
        };
      }}
      saveProfile={async ({ values, avatarUrl }) => {
        await patchMyShelterProfile({
          shelter_name: values.shelter_name?.trim(),
          about: values.about?.trim() || undefined,
          location: values.location?.trim() || undefined,
          contact_email: values.contact_email?.trim() || undefined,
          contact_phone: values.contact_phone?.trim() || undefined,
          logo_url: avatarUrl || undefined,
        });
      }}
      uploadAvatar={uploadMyShelterAvatar}
      onSaved={() => router.refresh()}
    />
  );
}
