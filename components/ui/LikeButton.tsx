"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

import heartIcon from "@/public/buttons/Like.svg";
import pawIcon from "@/public/buttons/Liked.svg";

import {
  getInitialLiked,
  setLiked,
  LikeTargetType,
} from "@/lib/services/likes";

function isExpectedAuthError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { name?: string; message?: string };
  return (
    maybeError.name === "AuthSessionMissingError"
    || maybeError.message?.includes("Auth session missing")
    || maybeError.message?.includes("You must be logged in to like")
    || false
  );
}

type Props = {
  targetType: LikeTargetType;
  targetId: string;
  className?: string;
  size?: number;
  theme?: "default" | "foster";
};

export default function LikeButton({ targetType, targetId, className, size = 136, theme = "default" }: Props) {
  const [liked, setLikedState] = useState(false);
  const [loading, setLoading] = useState(true);
  const fosterTheme = theme === "foster";

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const v = await getInitialLiked({ targetType, targetId });
        if (alive) setLikedState(v);
      } catch (e) {
        if (!isExpectedAuthError(e)) {
          console.error(e);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [targetType, targetId]);

  async function onToggle() {
    if (loading) return;

    const next = !liked;
    setLikedState(next);

    try {
      await setLiked({ targetType, targetId }, next);
    } catch (e) {
      if (!isExpectedAuthError(e)) {
        console.error(e);
      }
      setLikedState(!next);
      alert(e instanceof Error ? e.message : "Failed to update like.");
    }
  }

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      className={`select-none cursor-pointer disabled:opacity-60 ${className ?? ""}`}
      disabled={loading}
    >
      {fosterTheme ? (
        liked ? (
          <motion.span
            key="foster-paw"
            initial={{ scale: 0.4, opacity: 0, rotate: -18 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="inline-flex select-none items-center justify-center font-bold text-[#f08c00] drop-shadow-[0_2px_0_rgba(181,104,0,0.65)]"
            style={{ fontSize: `${Math.max(26, Math.round(size * 0.75))}px`, lineHeight: 1 }}
          >
            🐾
          </motion.span>
        ) : (
          <motion.div
            key="foster-heart"
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={heartIcon}
              alt="like"
              width={size}
              height={size}
            />
          </motion.div>
        )
      ) : (
        <motion.div
          key={liked ? "paw" : "heart"}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={liked ? pawIcon : heartIcon}
            alt={liked ? "liked" : "like"}
            width={size}
            height={size}
          />
        </motion.div>
      )}
    </motion.button>
  );
}
