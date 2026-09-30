"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardText, FileText, Plus } from "@phosphor-icons/react";

type Props = {
  isAdmin?: boolean;
  onOpenCreation: () => void;
};

export default function ShelterLinks({
  isAdmin = false,
  onOpenCreation,
}: Props) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-2">
      {isAdmin ? (
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="hover:scale-105 flex h-15 w-15 items-center justify-center rounded-full bg-primary shadow-sm transition hover:brightness-95"
        >
          <ClipboardText size={40} aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpenCreation}
          className="hover:scale-105 flex h-15 w-15 items-center justify-center rounded-full bg-primary shadow-sm transition hover:brightness-95"
        >
          <Plus size={40} aria-hidden="true" />
        </button>
      )}

      <Link
        href="/shelter/notification"
        className="hover:scale-105 flex h-15 w-15 items-center justify-center rounded-full bg-primary shadow-sm transition hover:brightness-95"
      >
        <FileText size={30} aria-hidden="true" />
      </Link>
    </div>
  );
}
