"use client";

import { useRouter } from "next/navigation";
import EditProfileModal from "./EditProfileModal";
import { fetchJson, uploadFile } from "@/src/lib/fetchJson";
import { unwrap } from "@/src/lib/actionResult";
import { updateMyUserAction } from "@/src/app/actions/profile";
import type { Users } from "@/src/lib/types/users";

export default function UserEditProfileModal() {
  const router = useRouter();

  return (
    <EditProfileModal
      title="Edit profile"
      fields={[
        { key: "full_name", label: "Full name" },
        { key: "username", label: "Username" },
        { key: "bio", label: "Bio" },
        { key: "contact_email", label: "Email", type: "email" },
      ]}
      loadProfile={async () => {
        const { data: profile } = await fetchJson<{ data: Users }>("/api/users", { cache: "no-store" });

        return {
          avatarUrl: profile.photo_url ?? "",
          full_name: profile.full_name ?? "",
          username: profile.username ?? "",
          bio: profile.bio ?? "",
          contact_email: profile.contact_email ?? "",
        };
      }}
      saveProfile={async ({ values, avatarUrl }) => {
        unwrap(await updateMyUserAction({
          full_name: values.full_name?.trim(),
          username: values.username?.trim(),
          bio: values.bio?.trim() || undefined,
          contact_email: values.contact_email?.trim() || undefined,
          photo_url: avatarUrl || undefined,
        }));
      }}
      uploadAvatar={(file) => uploadFile("/api/users/avatar", file)}
      onSaved={() => router.refresh()}
    />
  );
}
