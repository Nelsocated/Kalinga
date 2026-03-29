"use client";

import type { NotificationItem } from "@/app/site/notification/page";
import Button from "../ui/Button";

type Props = {
  open: boolean;
  item: NotificationItem | null;
  onClose: () => void;
};

export default function StatusModal({ open, item, onClose }: Props) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-[15px] border bg-white shadow-2xl">
        <div className="flex items-center justify-center bg-primary px-6 py-2">
          <h2 className="text-subtitle font-extrabold text-black">
            {item.title}
          </h2>
        </div>

        <div className="space-y-2 p-4 md:p-6 overflow-y-auto scroll-stable">
          <p className="leading-5 text-lg text-black whitespace-pre-line text-justify">
            {item.fullMessage}
          </p>

          <div className="flex justify-end">
            <Button type="button" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
