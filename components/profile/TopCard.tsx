// components/profile/TopCard.tsx
"use client";

import React from "react";
import ProfileHeader from "./ProfileHeader";
import Image from "next/image";

export type TopCardProps = {
    title: string;
    subtitle?: string | null;
    location?: string | null;
    imageUrl?: string | null;
    variant?: "user" | "shelter" | "pet";

    leftSlot?: React.ReactNode;
    rightSlot?: React.ReactNode;
    actions?: React.ReactNode;
    meta?: React.ReactNode;
    belowHeader?: React.ReactNode;
    className?: string;
};

export default function TopCard({
    title,
    subtitle,
    location = "",
    imageUrl,
    variant = "user",
    leftSlot,
    rightSlot,
    actions,
    meta,
    belowHeader,
    className = "",
}: TopCardProps) {
    const headerPadding = variant === "shelter" ? "pt-6 pb-3" : "pt-6 pb-2";

    return (
        <div className={`rounded-3xl border border-black/10 bg-white p-5 ${className}`}>
            <div className={`relative ${headerPadding}`}>
                {leftSlot ? (
                    <div className="absolute -left-3 top-6">{leftSlot}</div>
                ) : null}

                <ProfileHeader
                    title={title}
                    subtitle={subtitle}
                    location={location ?? ""}
                    imageUrl={imageUrl}
                    likeButton={actions ?? <div />}
                    meta={meta}
                    actions={rightSlot}
                />
            </div>
            {belowHeader ? <div className="mt-4">{belowHeader}</div> : null}
        </div>
    );
}