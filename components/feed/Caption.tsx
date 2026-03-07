"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import meet_icon from "@/public/icons/meet.svg";
import Image from "next/image";

type Props = {
  id: string
  name: string;
  shelter_name: string;
  caption?: string | null;
};

export default function Caption({ id, name, shelter_name, caption }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const hasCaption = Boolean(caption && caption.trim().length > 0);

  return (
    <div className="absolute bottom-0 left-0 w-full text-white">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className={`relative z-10 w-full rounded-2xl overflow-hidden ${open ? "bg-[#795f08]" : ""
          }`}
      >
        <div className="px-4 py-5">
          <p className="font-bold text-xl leading-tight">{shelter_name}</p>

          {hasCaption && (
            <>
              <AnimatePresence initial={false} mode="wait">
                {open && (
                  <motion.p
                    key="caption"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 pb-4 text-sm text-white whitespace-pre-wrap wrap-break-word"
                  >
                    {caption}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="text-xs font-semibold hover:underline"
              >
                {open ? "Less" : "More"}
              </button>
            </>
          )}
          <button
            type="button"
            className="text-l font-bold text-white hover:underline absolute bottom-3 right-13"
            onClick={() => router.push(`/site/pet/${id}`)}
          >
            Meet {name}!
          </button>
          <Image
            src={meet_icon}
            alt="meet-icon"
            className="absolute bottom-3 right-3"
          />
        </div>
      </motion.div>
    </div>
  );
}
