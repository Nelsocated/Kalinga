// components/layout/RightBar.tsx
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";

import ShareButton from "../ui/ShareButton";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";
import LikeButton from "../ui/LikeButton";

export type ShelterMini = {
  id: string;
  shelter_name?: string | null;
  logo_url?: string | null;
};

type Props = {
  media_id?: string;
  shelter?: ShelterMini | null;
};

export default function RightBar({ media_id, shelter }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {}, [pathname]);

  const goToShelter = () => {
    if (!shelter?.id) return;
    router.push(`/site/profiles/shelter/${shelter.id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <button
        type="button"
        onClick={goToShelter}
        className="h-17 w-17 rounded-full border overflow-hidden"
      >
        <Image
          src={shelter?.logo_url ?? DEFAULT_AVATAR_URL}
          alt="Shelter"
          width={110}
          height={110}
        />
      </button>

      {media_id ? (
        <LikeButton
          targetType="video"
          targetId={media_id}
          className="text-primary h-15"
        />
      ) : null}

      {media_id ? (
        <ShareButton id={media_id} type="video" className="w-13 h-13" />
      ) : null}
    </div>
  );
}
