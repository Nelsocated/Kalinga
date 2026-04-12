"use client";

import Image from "next/image";
import Link from "next/link";
import Plus from "@/public/icons/Plus.svg";
import File from "@/public/icons/FIle.svg";
import Application from "@/public/buttons/Application.svg";
import { useRouter } from "next/navigation";

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
          className="flex h-15 w-15 items-center justify-center rounded-full bg-primary shadow-sm transition hover:brightness-95"
        >
          <Image
            src={Application}
            alt="application-icon"
            width={40}
            height={40}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpenCreation}
          className="flex h-15 w-15 items-center justify-center rounded-full bg-primary shadow-sm transition hover:brightness-95"
        >
          <Image src={Plus} alt="plus-icon" width={40} height={40} />
        </button>
      )}

      <Link
        href="/shelter/notification"
        className="flex h-15 w-15 items-center justify-center rounded-full bg-primary shadow-sm transition hover:brightness-95"
      >
        <Image src={File} alt="file-icon" width={30} height={30} />
      </Link>
    </div>
  );
}
