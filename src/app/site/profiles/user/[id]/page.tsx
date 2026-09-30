import { notFound } from "next/navigation";
import UserProfilePage from "./UserProfilePage";
import ContactRows from "@/src/components/template/ContactRows";
import ProfileTabs from "@/src/components/tabs/ProfileTab";
import { getUserById } from "@/src/lib/services/usersService";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getUserById(id);

  if (!data) {
    return notFound();
  }

  const user = {
    id: data.id,
    full_name: data.full_name,
    username: data.username,
    avatar_url: data.photo_url ?? null,
    bio: data.bio ?? null,
    contact: (
      <ContactRows email={data.contact_email} phone={data.contact_phone} />
    ),
    location: null,
    created_at: data.created_at,
  };

  return <UserProfilePage user={user} tabs={<ProfileTabs role="user" />} />;
}
