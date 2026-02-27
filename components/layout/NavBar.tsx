"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import Button from "@/components/ui/Button";
import Input from "../ui/input";
import { createClient } from "@/lib/supabase/client";

import kalinga_logo from "@/public/kalinga_logo.svg";
import search_icon from "@/public/icons/search.svg";
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

  return (
    <aside className="w-56 shrink-0 pt-10">
      <div className="flex justify-center gap-3">
        <Image
          src={kalinga_logo}
          alt="kalinga-logo"
          width={150}
          height={150}
          priority
        />
      </div>

      <nav className="mt-1 text-xl space-y-2 text-black">
        <div className="relative w-full max-w-md">
          <Input
            type="search"
            placeholder="Search"
            icon={<Image src={search_icon} alt="search-icon" />}
            className="rounded-full pl-10"
          />
        </div>

        <Button
          type="button"
          className="flex border-none justify-start gap-3"
          onClick={() => router.push("/site/home")}
        >
          <Image src={fyp_icon} alt="fyp-icon" />
          <span>For You</span>
        </Button>

        <Button
          type="button"
          className="flex border-none justify-start gap-3"
          onClick={() => router.push("/site/explore")}
        >
          <Image src={explore_icon} alt="explore-icon" />
          <span>Explore</span>
        </Button>

        <Button
          type="button"
          className="flex border-none justify-start gap-3"
          onClick={() => router.push("/site/shelter")}
        >
          <Image src={shelter_icon} alt="shelter-icon" />
          <span>Shelter</span>
        </Button>

        <Button
          type="button"
          className="flex border-none justify-start gap-3"
          onClick={() => {
            if (userId) {
              router.push(`/site/profiles/user/${userId}`);
            }
          }}
        >
          <Image src={profile_icon} alt="profile-icon" />
          <span>Profile</span>
        </Button>

        <Button
          type="button"
          className="flex border-none justify-start gap-3"
          onClick={() => router.push("/site/notification")}
        >
          <Image src={notif_icon} alt="notif-icon" />
          <span>Notification</span>
        </Button>

        <Button
          type="button"
          className="flex border-none justify-start gap-3"
          onClick={() => router.push("/site/more")}
        >
          <Image src={more_icon} alt="more-icon" />
          <span>More</span>
        </Button>
      </nav>
    </aside>
  );
}