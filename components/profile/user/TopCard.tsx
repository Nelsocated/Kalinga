"use client";

import React from "react";
import ProfileHeader from "./ProfileHeader";

export type TopCardProps = {
  title: string;
  subtitle?: string | null;
  location?: string | null;
  imageUrl?: string | null;

  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  actions?: React.ReactNode;
  belowHeader?: React.ReactNode;
  className?: string;
};

export default function TopCard({
  title,
  subtitle,
  location = "",
  imageUrl,
  leftSlot,
  rightSlot,
  actions,
  belowHeader,
  className = "",
}: TopCardProps) {
  return (
    <div className={`rounded-3xl ${className}`}>
      {leftSlot ? <div className="absolute -left-3">{leftSlot}</div> : null}

      <ProfileHeader
        title={title}
        subtitle={subtitle}
        location={location}
        imageUrl={imageUrl}
        actions={actions}
        rightSlot={rightSlot}
        titleClassName="text-4xl md:text-5xl font-bold"
        avatarClassName="rounded-full"
      />

      {belowHeader ? <div>{belowHeader}</div> : null}
    </div>
  );
}
