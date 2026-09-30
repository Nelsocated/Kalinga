"use client";
import { useRouter } from "next/navigation";
import { SquaresFour } from "@phosphor-icons/react";

export default function DashboardButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/shelter/dashboard")}
      className="flex w-fit items-center gap-2 rounded-[15px] border text-secondary border-black/50 bg-primary px-4 py-1 text-sm font-semibold hover:scale-105"
    >
      Dashboard
      <SquaresFour size={16} aria-hidden="true" />
    </button>
  );
}
