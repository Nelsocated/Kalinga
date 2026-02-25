// components/layout/RightBar.tsx
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

import Button from "../ui/Button";
import LikeButton from "../ui/LikeButton";
import up_button from "@/public/buttons/Up.svg";
import down_button from "@/public/buttons/Down.svg";
import copy_button from "@/public/buttons/Copy.svg"

import { LikeTargetType } from "@/lib/services/likes";

type FeedNav = {
  next: () => void;
  prev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  index: number;
  total: number;
};

export type ShelterMini = {
  id: string;
  shelter_name?: string | null;
  logo_url?: string | null;
};

type Props = {
  type: LikeTargetType;
  pet_id: string;
  shelter?: ShelterMini | null;
  nav?: FeedNav | null;
};

export default function RightBar({ type, pet_id, shelter, nav }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [fullUrl, setFullUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFullUrl(window.location.origin + pathname);
  }, [pathname]);

  const goToShelter = () => {
    if (!shelter?.id) return;
    router.push(`/profile/${shelter.id}`);
  };

  const copyLink = async () => {
    try {
      const u = new URL(window.location.href);
      u.searchParams.set("pet", pet_id);
      await navigator.clipboard.writeText(u.toString());

      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  return (
    <div className="relative h-full w-40 flex items-center justify-center">
      <div className="absolute right-8 flex flex-col items-center gap-6">

        <button
          type="button"
          onClick={goToShelter}
          className="h-20 w-20 rounded-full overflow-hidden"
        >
          <Image
            src={shelter?.logo_url ?? "/fallback.png"}
            alt="Shelter"
            width={90}
            height={90}
            className="h-full w-full object-cover"
          />
        </button>

        <div className="scale-95">
          <LikeButton targetType={type} targetId={pet_id} />
        </div>

        <button
          type="button"
          onClick={copyLink}
          className="w-15 h-15 p-0 rounded-full overflow-hidden  border-1 border-[#f3be0f] hover:bg-[#f3be0f] flex items-center justify-center"
        >
          {copied ? (
            "Copied!"
          ) : (
            <>
              <Image src={copy_button} alt="copy-button" width={30} height={30} />
            </>
          )}
        </button>

      </div>

      <div className="absolute right-[-150px] top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <Button
          type="button"
          onClick={() => nav?.prev()}
          className={`border-none hover:bg-transparent hover:shadow-none hover:scale-100 ${nav?.hasPrev ? "" : "opacity-50 pointer-events-none"}`}
        >
          <Image src={up_button} alt="up-button" />
        </Button>

        <Button
          type="button"
          onClick={() => nav?.next()}
          className={`border-none hover:bg-transparent hover:shadow-none hover:scale-100 ${nav?.hasNext ? "" : "opacity-50 pointer-events-none"}`}
        >
          <Image src={down_button} alt="down-button" />
        </Button>
      </div>
    </div>
  );
}