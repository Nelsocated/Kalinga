"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useRef, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "../ui/input";
import kalinga_logo from "@/public/kalinga_logo.svg";
import search_icon from "@/public/icons/search.svg";
import fyp_icon from "@/public/icons/play-circle.svg";
import explore_icon from "@/public/icons/Explore.svg";
import shelter_icon from "@/public/icons/Home.svg";
import profile_icon from "@/public/icons/user.svg";
import notif_icon from "@/public/icons/notifications.svg";
import more_icon from "@/public/icons/More horizontal.svg";
import MoreDropdown from "./MoreDropdown";

export default function Navbar() {
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <aside className="ml-6 lg:ml-8 w-56 shrink-0 pt-10 relative">
      <div className="flex justify-center gap-3">
        <Image
          src={kalinga_logo}
          alt="kalinga-logo"
          width={150}
          height={150}
          priority
        ></Image>
      </div>

      <nav className="mt-1 text-xl space-y-2 text-black">
        <div className="relative w-full max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <Image src={search_icon} alt="search-icon" />
          </span>
          <Input
            type="search"
            placeholder="Search"
            className="rounded-full"
            icon={<Image src={search_icon} alt="search-icon" />}
            iconPosition="left"
          ></Input>
        </div>
        <Button
          type="button"
          className="flex border-none justify-start gap-3"
          onClick={() => router.push("/site/home")}
        >
          <Image src={fyp_icon} alt="fyp-icon" />
          <span> For You</span>
        </Button>
        <Button
          type="button"
          className="flex border-none justify-start gap-3"
          onClick={() => router.push("/site/explore")}
        >
          <Image src={explore_icon} alt="explore-icon" />
          <span> Explore</span>
        </Button>
        <Button
          type="button"
          className="flex border-none justify-start gap-3"
          onClick={() => router.push("/site/shelter")}
        >
          <Image src={shelter_icon} alt="shelter-icon" />
          <span> Shelter</span>
        </Button>
        <Button
          type="button"
          className="flex border-none justify-start gap-3"
          onClick={() => router.push("/site/profile")}
        >
          <Image src={profile_icon} alt="profile-icon" />
          <span> Profile</span>
        </Button>
        <Button
          type="button"
          className="flex border-none justify-start gap-3"
          onClick={() => router.push("/site/notification")}
        >
          <Image src={notif_icon} alt="notif-icon" />
          <span> Notification</span>
        </Button>
        <Button
          type="button"
          className="flex border-none justify-start gap-3"
          ref={moreBtnRef}
          onClick={() => setMoreOpen((v) => !v)}
        >
          <Image src={more_icon} alt="more-icon" />
          <span> More</span>
        </Button>
        <MoreDropdown open={moreOpen} onClose={() => setMoreOpen(false)} anchorRef={moreBtnRef} />
      </nav>
    </aside>
  );
}
