"use client";

import DashboardHeader from "@/src/components/template/DashboardHeader";
import ContentCard from "../../../components/cards/ContentCard";
import WebTemplate from "@/src/components/template/WebTemplate";

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
      header={<div>Dashboard</div>}
      main={
        <main className="flex h-full min-h-0 flex-col">
          <DashboardHeader stats={stats} />

          <section className="flex min-h-0 flex-1 flex-col px-4 py-3">
            <h2 className="mb-3 text-3xl font-extrabold text-black">Content</h2>

            <div className="min-h-0 flex-1">
              <ContentCard items={items} />
            </div>
          </section>
        </main>
      }
    />
  );
}
