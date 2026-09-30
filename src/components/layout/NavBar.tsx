"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Bell,
  ChatCircle,
  Compass,
  House,
  PlayCircle,
  User,
  type Icon,
} from "@phosphor-icons/react";

import Button from "../ui/Button";
import FilterModal from "../modal/FilterModal";
import MoreModal from "../modal/MoreModal";

import {
  getAuthUser,
  getProfileRouteByRole,
  getNotifRouteByRole,
  getMsgRouteByRole,
  type AuthUser,
} from "@/src/lib/utils/clientAuth";

type IconItem = {
  title: string;
  icon: Icon;
  link: string | ((authUser: AuthUser | null) => string | undefined | null);
};

export default function Navbar() {
  const router = useRouter();

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function loadAuthUser() {
      const user = await getAuthUser();
      setAuthUser(user);
    }

    loadAuthUser();
  }, []);

  const buttonStyle = "flex w-full gap-3 border-none text-lg hover:scale-105";

  const icons: IconItem[] = [
    {
      title: "For You",
      icon: PlayCircle,
      link: "/site/home",
    },
    {
      title: "Explore",
      icon: Compass,
      link: "/site/explore",
    },
    {
      title: "Shelters",
      icon: House,
      link: "/site/shelters",
    },
    {
      title: "Profile",
      icon: User,
      link: (user) => (user ? getProfileRouteByRole(user) : undefined),
    },
    {
      title: "Notifications",
      icon: Bell,
      link: (user) => (user ? getNotifRouteByRole(user) : undefined),
    },
    {
      title: "Messages",
      icon: ChatCircle,
      link: (user) => (user ? getMsgRouteByRole(user) : undefined),
    },
  ];

  const handleNavigate = (item: IconItem) => {
    const route =
      typeof item.link === "function" ? item.link(authUser) : item.link;
    if (!route) return;
    router.push(route);
  };

  return (
    <aside className="max-w-sm">
      <div>
        <Image
          src={"/kalinga_logo.svg"}
          alt="kalinga-logo"
          width={100}
          height={100}
          priority
        />
      </div>

      <nav className="mt-3 space-y-2 text-xl text-black">
        <div className="flex">
          <FilterModal />
        </div>

        {icons.map((item) => (
          <Button
            key={item.title}
            type="button"
            className={buttonStyle}
            onClick={() => handleNavigate(item)}
          >
            <item.icon size={25} aria-hidden="true" />
            <span>{item.title}</span>
          </Button>
        ))}

        <MoreModal />
      </nav>
    </aside>
  );
}
