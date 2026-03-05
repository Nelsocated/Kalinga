"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

function LikeSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="40 0 60 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[#F3C52A] ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M94.7439 13.4458C93.3287 11.9554 91.6484 10.7731 89.799 9.96645C87.9495 9.15981 85.9673 8.74463 83.9654 8.74463C81.9635 8.74463 79.9812 9.15981 78.1318 9.96645C76.2824 10.7731 74.6021 11.9554 73.1868 13.4458L70.2498 16.5375L67.3127 13.4458C64.454 10.4367 60.5769 8.74619 56.5342 8.74619C52.4914 8.74619 48.6143 10.4367 45.7556 13.4458C42.897 16.4549 41.291 20.5361 41.291 24.7916C41.291 29.0471 42.897 33.1284 45.7556 36.1375L70.2498 61.9208L94.7439 36.1375C96.1598 34.6477 97.283 32.879 98.0493 30.9322C98.8156 28.9855 99.21 26.8989 99.21 24.7916C99.21 22.6844 98.8156 20.5978 98.0493 18.651C97.283 16.7042 96.1598 14.9355 94.7439 13.4458Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LikedSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="40 0 60 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[#F3C52A] ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M53.0565 34.0675C53.9928 33.1733 55.1046 32.4639 56.3283 31.9799C57.552 31.4959 58.8636 31.2468 60.1881 31.2468C61.5127 31.2468 62.8243 31.4959 64.0479 31.9799C65.2716 32.4639 66.3834 33.1733 67.3198 34.0675L69.2631 35.9225L71.2065 34.0675C73.0979 32.2621 75.6632 31.2478 78.3381 31.2478C81.013 31.2478 83.5784 32.2621 85.4698 34.0675C87.3612 35.873 88.4238 38.3217 88.4238 40.875C88.4238 43.4283 87.3612 45.8771 85.4698 47.6825L69.2631 63.1525L53.0565 47.6825C52.1196 46.7887 51.3765 45.7274 50.8694 44.5594C50.3624 43.3913 50.1014 42.1394 50.1014 40.875C50.1014 39.6107 50.3624 38.3587 50.8694 37.1906C51.3765 36.0226 52.1196 34.9613 53.0565 34.0675Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M84.6266 27.7377C80.166 26.1713 78.4662 20.2226 80.83 14.4509C83.1938 8.67914 88.726 5.27003 93.1866 6.83642C97.6472 8.4028 99.347 14.3515 96.9832 20.1233C94.6194 25.895 89.0872 29.3041 84.6266 27.7377Z"
        fill="currentColor"
      />
      <path
        d="M68.7632 26C64.0688 26 60.2632 21.0751 60.2632 15C60.2632 8.92487 64.0688 4 68.7632 4C73.4576 4 77.2632 8.92487 77.2632 15C77.2632 21.0751 73.4576 26 68.7632 26Z"
        fill="currentColor"
      />
      <path
        d="M53.4644 27.1165C57.8082 25.5911 59.4635 19.7981 57.1616 14.1774C54.8597 8.5567 49.4722 5.23681 45.1284 6.7622C40.7846 8.28759 39.1293 14.0806 41.4312 19.7013C43.7331 25.322 49.1206 28.6419 53.4644 27.1165Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function LikeButton({
  targetType,
  targetId,
  className = "",
}: Props) {
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
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.8 }}
      disabled={loading}
      className="select-none cursor-pointer disabled:opacity-60"
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <motion.div
        key={liked ? "liked" : "like"}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {liked ? (
          <LikedSvg className={className} />
        ) : (
          <LikeSvg className={className} />
        )}
      </motion.div>
    </motion.button>
  );
}
