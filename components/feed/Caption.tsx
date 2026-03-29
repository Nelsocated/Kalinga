"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import meet_icon from "@/public/icons/meet.svg";
import Image from "next/image";

type Props = {
  id: string;
  name: string;
  shelter_name: string;
  caption?: string | null;
};

export default function Caption({ id, name, shelter_name, caption }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const cleanCaption =
    "idk my name anymore heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee".trim();
  const hasCaption = cleanCaption.length > 0;

  return (
    <div className="absolute bottom-0 left-0 w-full text-white">
      <motion.div
        layout
        transition={{ type: "tween", stiffness: 320, damping: 30 }}
        className={[
          "relative z-10 w-full overflow-hidden rounded-[15px]",
          open
            ? "bg-[#795F07]"
            : "bg-linear-to-t from-black/70 via-black/40 to-transparent",
        ].join(" ")}
      >
        <div
          className={["px-5 py-3", open ? "flex flex-col h-64" : ""].join(" ")}
        >
          <p className="text-subtitle font-bold leading-tight">
            {shelter_name}
          </p>

          {hasCaption && (
            <>
              {!open && (
                <p className="text-description text-white/95 line-clamp-2 wrap-break-words truncate">
                  {cleanCaption}
                </p>
              )}

              <AnimatePresence initial={false} mode="wait">
                {open && (
                  <motion.p
                    key="caption"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 mb-2 text-description text-white whitespace-pre-wrap wrap-break-words break-all text-justify grow overflow-y-auto"
                  >
                    {cleanCaption}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className="text-description font-medium hover:underline"
                >
                  {open ? "Less" : "More"}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="text-subtitle font-bold text-white hover:underline"
                    onClick={() => router.push(`/site/profiles/pets/${id}`)}
                  >
                    Meet {name}!
                  </button>

                  <Image
                    src={meet_icon}
                    alt="meet-icon"
                    width={50}
                    height={50}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
