"use client";

import React from "react";
import PetProfileHeader from "./PetProfileHeader";

export type PetTopCardProps = {
    title: string;
    subtitle?: string | null;
    location?: string | null;
    imageUrl?: string | null;
    sex?: React.ReactNode;

    leftSlot?: React.ReactNode;
    rightSlot?: React.ReactNode;
    actions?: React.ReactNode;
    meta?: React.ReactNode;
    belowHeader?: React.ReactNode;
    className?: string;
};

export default function PetTopCard({
    title,
    subtitle,
    location = "",
    imageUrl,
    sex,
    leftSlot,
    rightSlot,
    actions,
    meta,
    belowHeader,
    className = "",
}: PetTopCardProps) {
    return (
        <div className={`rounded-3xl border border-black/10 bg-white p-5 ${className}`}>
            <div className="relative pt-6 pb-2">
                {leftSlot ? <div className="absolute -left-3 top-6">{leftSlot}</div> : null}

                <PetProfileHeader
                    title={title}
                    subtitle={subtitle}
                    location={location}
                    imageUrl={imageUrl}
                    likeButton={actions ?? <div />}
                    meta={meta}
                    actions={rightSlot}
                    sex={sex}
                />
            </div>

            {belowHeader ? <div className="mt-4">{belowHeader}</div> : null}
        </div>
    );
}