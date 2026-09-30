"use client";

import DashboardHeader from "@/src/components/template/DashboardHeader";
import ContentCard from "../../../components/cards/ContentCard";
import WebTemplate from "@/src/components/template/WebTemplate";
import { LinkButton } from "@/src/components/ui/Button";
import { Plus } from "@phosphor-icons/react";

export type DashboardStats = {
  totalViews: number;
  totalLikes: number;
  totalAdoptionsCompleted: number;
};

export type DashboardContentItem = {
  id: string;
  title: string;
  petName: string;
  datePosted: string | null;
  views: number;
  likes: number;
  photo_url: string | null;
  species: string | null;
};

type Props = {
  stats: DashboardStats;
  items: DashboardContentItem[];
};
export default function DashboardPage({ stats, items }: Props) {
  return (
    <WebTemplate
      header="Dashboard"
      actions={
        <LinkButton href="/shelter/creation" variant="primary" icon={<Plus weight="bold" aria-hidden="true" />}>
          Create
        </LinkButton>
      }
      main={
        <div className="flex flex-col gap-8">
          <DashboardHeader stats={stats} />
          <ContentCard items={items} />
        </div>
      }
    />
  );
}
