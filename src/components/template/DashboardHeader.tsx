import type { DashboardStats } from "../../app/shelter/dashboard/DashboardClient";

type Props = {
  stats: DashboardStats;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Totals across the shelter's posts, as plain numbers. */
export default function DashboardHeader({ stats }: Props) {
  const items = [
    { label: "Views", value: stats.totalViews },
    { label: "Likes", value: stats.totalLikes },
    { label: "Adoptions completed", value: stats.totalAdoptionsCompleted },
  ];

  return (
    <dl className="grid grid-cols-3 divide-x divide-line rounded-lg border border-line bg-card">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1 px-4 py-4 sm:px-6 sm:py-5">
          <dt className="text-xs font-medium text-muted sm:text-sm">{item.label}</dt>
          <dd className="text-headline tabular-nums text-ink">{formatCount(item.value)}</dd>
        </div>
      ))}
    </dl>
  );
}
