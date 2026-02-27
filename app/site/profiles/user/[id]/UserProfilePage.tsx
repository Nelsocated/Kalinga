"use client";

import TopCard from "@/components/profile/TopCard";
import ProfileSection from "@/components/profile/ProfileSection";
import ProfileTabsCard from "@/components/profile/ProfileTabsCard";
import ProfileShell from "@/components/profile/PetProfileTemplate";

type UserUI = {
    id: string;
    full_name: string;
    username: string;
    location?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    contact?: string | null;
    created_at?: string | null;
};

export default function UserProfilePage({ user }: { user: UserUI }) {
    return (
        <ProfileShell
            side={<ProfileTabsCard />}
            main={
                <>
                    <TopCard
                        title={user.full_name}
                        subtitle={`@${user.username}`}
                        location={user.location ?? ""}
                        imageUrl={user.avatar_url}
                        variant="user"
                        rightSlot={
                            <div className="flex items-center gap-2">
                                <button className="rounded-full border px-3 py-1 text-sm">
                                    Edit
                                </button>
                            </div>
                        }
                        meta={
                            user.created_at ? (
                                <div className="text-sm opacity-60">
                                    Member since {new Date(user.created_at).getFullYear()}
                                </div>
                            ) : (
                                <div className="text-sm opacity-60">Member</div>
                            )
                        }
                    />

                    <ProfileSection title="Bio">{user.bio ?? "—"}</ProfileSection>
                    <ProfileSection title="Contact">{user.contact ?? "—"}</ProfileSection>
                </>
            }
        />
    );
}