import { notFound } from "next/navigation";
import UserProfilePage from "./UserProfilePage";
import { getUserProfileById } from "@/lib/db/profiles";

export default async function Page(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const data = await getUserProfileById(id).catch(() => null);
    if (!data) return notFound();

    const user = {
        id: data.id,
        full_name: data.full_name,
        username: data.username,
        avatar_url: data.photo_url ?? null,
        bio: data.bio ?? null,
        contact: [data.contact_email, data.contact_phone]
            .filter(Boolean)
            .join(" • ") || null,
        location: null,
        created_at: data.created_at,
    };

    return <UserProfilePage user={user} />;
}