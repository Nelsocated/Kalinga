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

type Props = {
  targetType: LikeTargetType;
  targetId: string;
  className?: string;
};

export default function LikeButton({ targetType, targetId, className }: Props) {
  const [liked, setLikedState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const v = await getInitialLiked({ targetType, targetId });
        if (alive) setLikedState(v);
      } catch (e) {
        console.error(e);
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
      console.error(e);
      setLikedState(!next);
      alert(e instanceof Error ? e.message : "Failed to update like.");
    }
  }

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.8 }}
      className="select-none cursor-pointer disabled:opacity-60"
      disabled={loading}
    >
      <motion.div
        key={liked ? "paw" : "heart"}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={liked ? pawIcon : heartIcon}
          alt={liked ? "liked" : "like"}
          width={136}
          height={136}
        />
      </motion.div>
    </motion.button>
  );
}
