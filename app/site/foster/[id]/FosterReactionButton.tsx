"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FosterReactionButtonProps = {
  className?: string;
};

export default function FosterReactionButton({ className }: FosterReactionButtonProps) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.button
      type="button"
      aria-label={liked ? "Liked foster story" : "Like foster story"}
      onClick={() => setLiked((current) => !current)}
      whileTap={{ scale: 0.86 }}
      className={className ?? "leading-none"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {liked ? (
          <motion.span
            key="paw"
            initial={{ scale: 0.55, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.55, rotate: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block text-4xl font-black text-[#f3be0f]"
          >
            🐾
          </motion.span>
        ) : (
          <motion.span
            key="heart"
            initial={{ scale: 0.55, rotate: 10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.55, rotate: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block text-4xl font-bold text-[#f3be0f]"
          >
            ♡
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
