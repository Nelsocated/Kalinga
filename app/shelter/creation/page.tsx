"use client";
import at_pet from "@/public/tabs/at_pet.svg";
import Video from "@/public/icons/Video.svg";
import Foster from "@/public/icons/Foster.svg";
const actions = [
  {
    label: "Post a Video",
    icon: Video,
    href: "/shelter/post-video",
  },
  {
    label: "Add a Pet",
    icon: at_pet,
    href: "/shelter/add-pet",
  },
  {
    label: "Write a Foster Story",
    icon: Foster,
    href: "/shelter/foster-story",
  },
];

export default function CreationPort() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center gap-4 px-6">
      {/* Action Cards */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {actions.map(({ label, icon, href }) => (
          <a
            key={label}
            href={href}
            className="flex flex-col items-center justify-center gap-2 bg-primary rounded-2xl py-7 shadow-md hover:brightness-95 active:scale-95 transition-all duration-150"
          >
            {icon}
            <span className="text-white font-semibold text-base tracking-wide">
              {label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
