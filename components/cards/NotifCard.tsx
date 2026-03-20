import type { NotificationItem } from "@/app/site/notification/page";

type Props = {
  item: NotificationItem;
  isActive?: boolean;
  onSelect?: () => void;
  onOpenDetails?: () => void;
};

export default function NotifCard({ item, isActive = false, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative grid w-full grid-cols-1 gap-3 border-y bg-white px-4 py-2 text-left transition md:grid-cols-[1.1fr_1.7fr_1fr] md:items-center"
    >
      {/* divider after col 1 */}
      <div className="pointer-events-none absolute top-0 bottom-0 hidden w-px bg-primary md:block left-[calc(1.1/(1.1+1.7+1)*100%)]" />

      {/* divider after col 2 */}
      <div className="pointer-events-none absolute top-0 bottom-0 hidden w-px bg-primary md:block left-[calc((1.1+1.7)/(1.1+1.7+1)*100%)]" />

      <div className="flex justify-center text-lg font-medium">
        {item.shelter}
      </div>

      <div className="md:px-6">
        <p className="text-justify text-lg font-semibold leading-snug">
          {item.shortMessage}{" "}
          <span className="cursor-pointer text-primary hover:underline text-justify">
            See more!
          </span>
        </p>
      </div>
      <div className="flex justify-center text-lg font-medium">{item.date}</div>
    </button>
  );
}
