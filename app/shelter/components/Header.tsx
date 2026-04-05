import type { DashboardStats } from "../dashboard/DashboardClient";
import Image from "next/image";
import ViewIcon from "@/public/tabs/Play-icon.svg";
import LikeIcon from "@/public/tabs/Heart.svg";
import PawIcon from "@/public/tabs/at_pet.svg";

type Props = {
  stats: DashboardStats;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function StatCard({
  icon,
  value,
  label,
  custom,
}: {
  icon: string;
  value: number;
  label: string;
  custom?: number;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-[15px] bg-primary px-4 py-3">
      {/* Icon */}
      <div className="flex h-9 w-20 items-center justify-center">
        <Image
          src={icon}
          alt={label}
          width={custom ?? 35}
          height={custom ?? 35}
        />
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

export default function Header({ stats }: Props) {
  return (
    <section className="border-b-2 bg-white px-2 py-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon={ViewIcon} value={stats.totalViews} label="Views" />
        <StatCard icon={LikeIcon} value={stats.totalLikes} label="Likes" />
        <StatCard
          icon={PawIcon}
          value={stats.totalAdoptionsCompleted}
          label="Adoption Completed"
          custom={70}
        />
      </div>
    </section>
  );
}
