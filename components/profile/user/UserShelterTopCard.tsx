"use client";

import React from "react";
import BaseProfileHeader from "./BaseProfileHeader";

export type UserShelterTopCardProps = {
  title: string;
  subtitle?: string | null;
  location?: string | null;
  imageUrl?: string | null;

  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  belowHeader?: React.ReactNode;
  className?: string;
};

export default function UserShelterTopCard({
  title,
  subtitle,
  location = "",
  imageUrl,
  leftSlot,
  rightSlot,
  actions,
  meta,
  belowHeader,
  className = "",
}: UserShelterTopCardProps) {
  return (
    <div className={`rounded-3xl ${className}`}>
      {leftSlot ? <div className="absolute -left-3">{leftSlot}</div> : null}

      <BaseProfileHeader
        title={title}
        subtitle={subtitle}
        location={location}
        imageUrl={imageUrl}
        meta={meta}
        actions={actions}
        rightSlot={rightSlot}
        titleClassName="text-4xl md:text-5xl font-bold"
        avatarClassName="rounded-full"
      />

      {belowHeader ? <div>{belowHeader}</div> : null}
    </div>
  );
}
