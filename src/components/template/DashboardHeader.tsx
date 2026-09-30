import type { DashboardStats } from "../../app/shelter/dashboard/DashboardClient";
import {
  Heart,
  PawPrint,
  Play,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

type Props = {
  stats: DashboardStats;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function StatCard({
  icon: StatIcon,
  value,
  label,
}: {
  icon: Icon;
  value: number;
  label: string;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-[15px] bg-primary px-4 py-3">
      {/* Icon */}
      <div className="flex h-9 w-20 items-center justify-center">
        <StatIcon size={32} weight="fill" aria-hidden="true" />
      </div>

      {/* Text */}
      <div className="min-w-0 leading-tight flex justify-center items-center flex-col">
        <div className="text-title font-extrabold text-black">
          {formatCount(value)}
        </div>
        <div className="text-description font-medium text-black">{label}</div>
      </div>
    </div>
  );
}

export default function DashboardHeader({ stats }: Props) {
  return (
    <section className="border-b-2 bg-white px-2 py-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={Play}
          value={stats.totalViews}
          label="Views"
        />
        <StatCard
          icon={Heart}
          value={stats.totalLikes}
          label="Likes"
        />
        <StatCard
          icon={PawPrint}
          value={stats.totalAdoptionsCompleted}
          label="Adoption Completed"
        />
      </div>
    </section>
  );
}
