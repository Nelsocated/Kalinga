import { notFound } from "next/navigation";
import UserProfilePage from "./UserProfilePage";
import ContactRows from "@/src/components/template/ContactRows";
import ProfileTabs from "@/src/components/tabs/ProfileTab";
import { getUserById } from "@/src/lib/services/usersService";
import { getShelterIdByOwnerId } from "@/src/lib/services/shelterService";
import { hasAppliedToShelter } from "@/src/lib/services/adoptionService";
import { getAuthUser } from "@/src/lib/utils/auth";
import type { AuthUser } from "@/src/lib/utils/clientAuth";

/** Contact details are for the owner, admins and shelters this person applied to. */
async function canSeeContact(viewer: AuthUser | null, profileId: string) {
  if (!viewer) return false;
  if (viewer.id === profileId || viewer.role === "admin") return true;
  if (viewer.role !== "shelter") return false;

  const shelterId = await getShelterIdByOwnerId(viewer.id);
  return shelterId ? hasAppliedToShelter(profileId, shelterId) : false;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [data, viewer] = await Promise.all([getUserById(id), getAuthUser()]);

  if (!data) {
    return notFound();
  }

  const isOwner = viewer?.id === id;
  const showContact = await canSeeContact(viewer, id).catch(() => false);

  const user = {
    id: data.id,
    full_name: data.full_name,
    username: data.username,
    avatar_url: data.photo_url ?? null,
    bio: data.bio ?? null,
    contact: showContact ? (
      <ContactRows email={data.contact_email} phone={data.contact_phone} />
    ) : null,
    location: null,
    created_at: data.created_at,
  };

  // Likes are private, so the likes tabs only show on your own profile
  return (
    <UserProfilePage
      user={user}
      isOwner={isOwner}
      tabs={isOwner ? <ProfileTabs role="user" /> : null}
    />
  );
}
