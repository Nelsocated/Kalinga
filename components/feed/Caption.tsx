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

  const cleanCaption = (caption ?? "").trim();
  const hasCaption = cleanCaption.length > 0;

  return (
    <div className="absolute bottom-0 left-0 w-full text-white">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className={[
          "relative z-10 w-full overflow-hidden rounded-2xl",
          open
            ? "bg-[#795f08]"
            : "bg-linear-to-t from-black/70 via-black/40 to-transparent",
        ].join(" ")}
      >
        <div className="px-3 py-3">
          <p className="text-xl font-bold leading-tight">{shelter_name}</p>

          {hasCaption && (
            <>
              {!open && (
                <p className="mt-1 pb-2 text-sm text-white/95 line-clamp-2 wrap-break-words">
                  {cleanCaption}
                </p>
              )}

              <AnimatePresence initial={false} mode="wait">
                {open && (
                  <motion.p
                    key="caption"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 pb-2 text-sm text-white whitespace-pre-wrap wrap-break-words"
                  >
                    {cleanCaption}
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
            className="absolute bottom-3 right-13 text-l font-bold text-white hover:underline"
            onClick={() => router.push(`/site/profiles/pets/${id}`)}
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
