import Button from "@/components/ui/Button";
import Input from "../ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";
import kalinga_logo from "@/public/kalinga_logo.svg";

export default function Navbar() {
  const router = useRouter();

  return (
    <aside className="w-56 shrink-0 pt-10">
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
        <Input type="search" placeholder="Search"></Input>
        <Button
          type="button"
          className="flex border-none justify-start"
          onClick={() => router.push("/home")}
        >
          For You
        </Button>
        <Button
          type="button"
          className="flex border-none justify-start"
          onClick={() => router.push("/explore")}
        >
          Explore
        </Button>
        <Button
          type="button"
          className="flex border-none justify-start"
          onClick={() => router.push("/shelter")}
        >
          Shelter
        </Button>
        <Button
          type="button"
          className="flex border-none justify-start"
          onClick={() => router.push("/profile")}
        >
          Profile
        </Button>
        <Button
          type="button"
          className="flex border-none justify-start"
          onClick={() => router.push("/notification")}
        >
          Notification
        </Button>
        <Button
          type="button"
          className="flex border-none justify-start"
          onClick={() => router.push("/more")}
        >
          More
        </Button>
      </nav>
    </aside>
  );
}
