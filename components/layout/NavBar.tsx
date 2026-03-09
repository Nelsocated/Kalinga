"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import FilterModal from "../modal/FilterModal";

import kalinga_logo from "@/public/kalinga_logo.svg";
import fyp_icon from "@/public/icons/play-circle.svg";
import explore_icon from "@/public/icons/Explore.svg";
import shelter_icon from "@/public/icons/Home.svg";
import profile_icon from "@/public/icons/user.svg";
import notif_icon from "@/public/icons/notifications.svg";
import more_icon from "@/public/icons/More horizontal.svg";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }
    }

    getUser();
  }, [supabase]);

  const buttonStyle = "flex border-none gap-3";
  return (
    <aside>
      <div>
        <Image
          src={kalinga_logo}
          alt="kalinga-logo"
          width={120}
          height={120}
          priority
        />
      </div>

      <nav className="mt-5 text-xl space-y-2 text-black">
        <div className="flex">
          <FilterModal />
        </div>

        <Button
          type="button"
          className={buttonStyle}
          onClick={() => router.push("/site/home")}
        >
          <Image src={fyp_icon} alt="fyp-icon" width={25} height={25} />
          <span>For You</span>
        </Button>

        <Button
          type="button"
          className={buttonStyle}
          onClick={() => router.push("/site/explore")}
        >
          <Image src={explore_icon} alt="explore-icon" width={25} height={25} />
          <span>Explore</span>
        </Button>

        <Button
          type="button"
          className={buttonStyle}
          onClick={() => router.push("/site/shelters")}
        >
          <Image src={shelter_icon} alt="shelter-icon" width={25} height={25} />
          <span>Shelters</span>
        </Button>

        <Button
          type="button"
          className={buttonStyle}
          onClick={() => {
            if (userId) {
              router.push(`/site/profiles/user/${userId}`);
            }
          }}
        >
          <Image src={profile_icon} alt="profile-icon" width={25} height={25} />
          <span>Profile</span>
        </Button>

        <Button
          type="button"
          className={buttonStyle}
          onClick={() => router.push("/site/notification")}
        >
          <Image src={notif_icon} alt="notif-icon" width={25} height={25} />
          <span>Notification</span>
        </Button>

        <Button
          type="button"
          className={buttonStyle}
          onClick={() => router.push("/site/more")}
        >
          <Image src={more_icon} alt="more-icon" width={25} height={25} />
          <span>More</span>
        </Button>
      </nav>
    </aside>
  );
}
