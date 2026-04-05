// components/layout/RightBar.tsx
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
import ShareButton from "../ui/ShareButton";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

import Button from "../ui/Button";
import LikeButton from "../ui/LikeButton";
import up_button from "@/public/buttons/Up.svg";
import down_button from "@/public/buttons/Down.svg";

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
  type: "pet" | "shelter" | "video";
  pet_id: string;
  media_id?: string;
  shelter?: ShelterMini | null;
  nav?: FeedNav | null;
};

export default function RightBar({ pet_id, media_id, shelter, nav }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {}, [pathname]);

  const goToShelter = () => {
    if (!shelter?.id) return;
    router.push(`/site/profiles/shelter/${shelter.id}`);
  };

  return (
    <div className="relative h-full w-40 flex items-center justify-center">
      <div className="absolute right-8 flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={goToShelter}
          className="h-17 w-17 rounded-full overflow-hidden"
        >
          <Image
            src={shelter?.logo_url ?? DEFAULT_AVATAR_URL}
            alt="Shelter"
            width={110}
            height={110}
          />
        </button>

        <div>
          {media_id ? (
            <LikeButton
              targetType="video"
              targetId={media_id}
              className="text-primary h-15"
            />
          ) : null}
        </div>

        {media_id ? (
          <ShareButton
            id={media_id}
            type="video"
            petId={pet_id}
            className="w-13 h-13"
          />
        ) : null}
      </div>
      <div className="absolute -right-37.5 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <Button
          type="button"
          onClick={() => nav?.prev()}
          className={`border-none hover:bg-transparent hover:shadow-none hover:scale-100 ${
            nav?.hasPrev ? "" : "opacity-50 pointer-events-none"
          }`}
        >
          <Image src={up_button} alt="up-button" />
        </Button>

        <Button
          type="button"
          onClick={() => nav?.next()}
          className={`border-none hover:bg-transparent hover:shadow-none hover:scale-100 ${
            nav?.hasNext ? "" : "opacity-50 pointer-events-none"
          }`}
        >
          <Image src={down_button} alt="down-button" />
        </Button>
      </div>
    </div>
  );
}
