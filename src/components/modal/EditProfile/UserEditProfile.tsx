"use client";

import { useRouter } from "next/navigation";
import EditProfileModal from "./EditProfileModal";
import {
  fetchMyUserProfile,
  patchMyUserProfile,
  uploadMyUserAvatar,
} from "@/src/lib/services/user/userClient";

export default function UserEditProfileModal() {
  const router = useRouter();

  return (
    <EditProfileModal
      title="Edit Profile"
      fields={[
        { key: "full_name", label: "Full Name" },
        { key: "username", label: "Username" },
        { key: "bio", label: "Bio" },
        { key: "contact_email", label: "Email", type: "email" },
      ]}
      loadProfile={async () => {
        const profile = await fetchMyUserProfile();

        return {
          avatarUrl: profile.photo_url ?? "",
          full_name: profile.full_name ?? "",
          username: profile.username ?? "",
          bio: profile.bio ?? "",
          contact_email: profile.contact_email ?? "",
        };
      }}
      saveProfile={async ({ values, avatarUrl }) => {
        await patchMyUserProfile({
          full_name: values.full_name?.trim(),
          username: values.username?.trim(),
          bio: values.bio?.trim() || undefined,
          contact_email: values.contact_email?.trim() || undefined,
          photo_url: avatarUrl || undefined,
        });
      }}
      uploadAvatar={uploadMyUserAvatar}
      onSaved={() => router.refresh()}
    />
  );
}
