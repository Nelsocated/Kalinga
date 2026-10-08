"use client";

import { motion, type Transition } from "motion/react";
import { AS_PAD, HEART_PATH, PAW_VIEWBOX, TOE_PATHS } from "./pawHeartPaths";

/** Kalinga's like icon: a heart with paw toes. Color comes from currentColor. */

const AS_HEART = { scale: 1, x: 0, y: 0 };

const centered = { transformBox: "fill-box", transformOrigin: "center" } as const;
const fromBase = { transformBox: "fill-box", transformOrigin: "50% 100%" } as const;

/**
 * The like toggle's icon. Liking settles the outline heart into a filled paw pad while the
 * three toes pop up over it; unliking tucks the toes away and opens the pad back into a heart.
 * Outline color comes from currentColor; the paw is always sunshine.
 * With reduced motion the two states cross-fade in place.
 */
export function PawHeartMorph({
  liked,
  reduce = false,
  className = "",
}: {
  liked: boolean;
  reduce?: boolean;
  className?: string;
}) {
  // Liking is the moment (a settling spring, toes in sequence); unliking is a quick exit
  const shape: Transition = reduce
    ? { duration: 0 }
    : liked
      ? { type: "spring", stiffness: 420, damping: 20 }
      : { duration: 0.18, ease: [0.16, 1, 0.3, 1] };
  const fade: Transition = { duration: reduce ? 0.15 : liked ? 0.2 : 0.12 };

  return (
    <svg viewBox={PAW_VIEWBOX} fill="none" className={className} aria-hidden="true" focusable="false">
      <motion.g
        initial={false}
        animate={liked ? AS_PAD : AS_HEART}
        transition={{ default: shape }}
        style={centered}
      >
        {/* Outline heart, fading out as it becomes the pad */}
        <motion.path
          d={HEART_PATH}
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ opacity: liked ? 0 : 1 }}
          transition={fade}
        />
        {/* Filled pad, fading in under the outline */}
        <motion.path
          d={HEART_PATH}
          className="fill-sunshine stroke-sunshine-deep"
          strokeWidth={2}
          strokeLinejoin="round"
          initial={false}
          animate={{ opacity: liked ? 1 : 0 }}
          transition={fade}
        />
      </motion.g>

      {TOE_PATHS.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          className="fill-sunshine"
          style={fromBase}
          initial={false}
          animate={liked ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.2, y: 8 }}
          transition={{
            default: reduce
              ? { duration: 0 }
              : liked
                ? { type: "spring", stiffness: 520, damping: 18, delay: 0.08 + i * 0.06 }
                : { duration: 0.12 },
            opacity: { duration: reduce ? 0.15 : 0.12, delay: reduce || !liked ? 0 : 0.08 + i * 0.06 },
          }}
        />
      ))}
    </svg>
  );
}

export function PawHeartFilled({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="40 0 62 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
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
