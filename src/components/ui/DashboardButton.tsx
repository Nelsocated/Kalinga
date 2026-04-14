"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Dashboard from "@/public/buttons/Dashboard.svg";

export default function DashboardButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/shelter/dashboard")}
      className="flex w-fit items-center gap-2 rounded-[15px] border text-secondary border-black/50 bg-primary px-4 py-1 text-sm font-semibold hover:scale-105"
    >
      Dashboard
      <Image src={Dashboard} alt="dashboard-button" width={15} height={15} />
    </button>
  );
}
