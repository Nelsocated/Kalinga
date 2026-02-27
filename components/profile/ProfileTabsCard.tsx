// components/profile/ProfileTabsCard.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

export type TabsKey = "shelters" | "pets" | "liked";

export type MiniItem = {
    id: string;
    title: string;
    subtitle?: string | null;
    imageUrl?: string | null;

    rating?: number | null;      // 0-5
    distanceKm?: number | null;  // number
    likedCount?: number | null;  // number
};

export default function ProfileTabsCard({
    defaultTab = "shelters",
    tabs = ["shelters", "pets", "liked"],
    shelters = [],
    pets = [],
    liked = [],
    onOpen,
}: {
    defaultTab?: TabsKey;
    tabs?: TabsKey[];
    shelters?: MiniItem[];
    pets?: MiniItem[];
    liked?: MiniItem[];
    onOpen?: (tab: TabsKey, id: string) => void;
}) {
    const [tab, setTab] = useState<TabsKey>(defaultTab);

    const items = useMemo(() => {
        if (tab === "pets") return pets;
        if (tab === "liked") return liked;
        return shelters;
    }, [tab, shelters, pets, liked]);

    return (
        <div className="h-full p-6">
            <div className="h-full rounded-2xl bg-[#f6f3ee]">
                {/* Tabs row */}
                <div className="flex items-center gap-2">
                    {tabs.includes("shelters") && (
                        <TabButton active={tab === "shelters"} onClick={() => setTab("shelters")}>
                            Shelters
                        </TabButton>
                    )}
                    {tabs.includes("pets") && (
                        <TabButton active={tab === "pets"} onClick={() => setTab("pets")}>
                            Pets
                        </TabButton>
                    )}
                    {tabs.includes("liked") && (
                        <TabButton active={tab === "liked"} onClick={() => setTab("liked")}>
                            Liked
                        </TabButton>
                    )}
                </div>

                {/* List */}
                <div className="mt-3 max-h-[72svh] space-y-3 overflow-auto pr-1">
                    {items.map((x) => (
                        <button
                            key={x.id}
                            onClick={() => onOpen?.(tab, x.id)}
                            className="w-full rounded-2xl border border-black/10 bg-white p-3 text-left shadow-sm hover:bg-black/5 transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-black/5">
                                    <Image
                                        src={(x.imageUrl ?? "").trim() || DEFAULT_AVATAR_URL}
                                        alt={x.title}
                                        width={64}
                                        height={64}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-semibold">{x.title}</div>
                                    {x.subtitle ? (
                                        <div className="truncate text-xs opacity-70">{x.subtitle}</div>
                                    ) : null}

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <Pill>{x.rating != null ? `${x.rating}/5` : "—/5"}</Pill>
                                        <Pill>{x.distanceKm != null ? `${x.distanceKm} km` : "— km"}</Pill>
                                        <Pill>{x.likedCount != null ? `${x.likedCount} liked` : "— liked"}</Pill>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}

                    {!items.length ? (
                        <div className="rounded-2xl border border-black/10 bg-white p-6 text-center text-sm opacity-60">
                            No items yet.
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                active
                    ? "bg-black text-white shadow-sm"
                    : "border border-black/10 bg-white hover:bg-black/5",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px]">
            {children}
        </span>
    );
}