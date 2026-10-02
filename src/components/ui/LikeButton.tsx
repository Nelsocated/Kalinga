"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PawHeartMorph } from "./PawHeart";
import { cn } from "@/src/lib/cn";
import { fetchJson } from "@/src/lib/fetchJson";
import { unwrap } from "@/src/lib/actionResult";
import { setLikeAction } from "@/src/app/actions/social";

export type LikeTargetType = "pet" | "shelter" | "video";
export type LikeHandle = { like: () => void };

type Props = {
  targetType: LikeTargetType;
  targetId: string;
  size?: "md" | "lg";
  /**
   * plain: icon on a light surface. outlined: bordered circle, for action rows.
   * overlay: white icon over video on phones, plain from md where the rail sits on the ground.
   */
  variant?: "plain" | "outlined" | "overlay";
  /** Shows "Like" / "Liked" under the icon (the feed rail). */
  showLabel?: boolean;
  className?: string;
};

const VARIANTS = {
  plain: "text-ink hover:bg-sunshine-wash",
  outlined: "border border-line bg-card text-ink hover:bg-sunshine-wash hover:shadow-lift",
  overlay:
    "text-card drop-shadow-[0_1px_6px_rgb(4_38_102/0.55)] md:text-ink md:drop-shadow-none md:hover:bg-sunshine-wash",
};

/**
 * The paw-heart toggle: liking morphs the heart into a paw with a sunshine ring.
 * The ref's like() only ever likes, for double-tap on the feed.
 */
const LikeButton = forwardRef<LikeHandle, Props>(function LikeButton(
  { targetType, targetId, size = "md", variant = "plain", showLabel = false, className },
  ref,
) {
  const [liked, setLiked] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Bumped on user toggles only, so a liked state that loads in doesn't animate
  const [pulse, setPulse] = useState(0);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let alive = true;
    const params = new URLSearchParams({ targetType, targetId });

    fetchJson<{ data: { liked: boolean } }>(`/api/likes?${params}`, { cache: "no-store" })
      .then((r) => alive && setLiked(r.data.liked))
      .catch(() => {})
      .finally(() => alive && setReady(true));

    return () => {
      alive = false;
    };
  }, [targetType, targetId]);

  useEffect(() => () => {
    if (errorTimer.current) clearTimeout(errorTimer.current);
  }, []);

  const setTo = useCallback(
    async (next: boolean) => {
      setLiked(next);
      setPulse((n) => n + 1);
      setError(null);

      try {
        unwrap(await setLikeAction({ targetType, targetId }, next));
      } catch (e) {
        setLiked(!next);
        setError(e instanceof Error ? e.message : "Couldn't update like.");
        if (errorTimer.current) clearTimeout(errorTimer.current);
        errorTimer.current = setTimeout(() => setError(null), 3000);
      }
    },
    [targetType, targetId],
  );

  useImperativeHandle(
    ref,
    () => ({
      like: () => {
        if (ready && !liked) void setTo(true);
      },
    }),
    [ready, liked, setTo],
  );

  const iconSize = size === "lg" ? "size-9" : "size-7";

  return (
    <span className="relative inline-flex">
      <span className="flex flex-col items-center gap-0.5">
        <button
          type="button"
          onClick={() => setTo(!liked)}
          disabled={!ready}
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          className={cn(
            "relative flex size-12 cursor-pointer items-center justify-center rounded-full transition-[background-color,box-shadow,transform] duration-200 ease-out-expo active:scale-90 disabled:cursor-default disabled:opacity-60",
            VARIANTS[variant],
            className,
          )}
        >
          <PawHeartMorph liked={liked} reduce={!!reduce} className={iconSize} />

          {/* One soft sunshine ring per like; keyed so repeat likes replay it */}
          <AnimatePresence>
            {liked && pulse > 0 && !reduce ? (
              <motion.span
                key={pulse}
                aria-hidden="true"
                className="pointer-events-none absolute inset-1 rounded-full border-2 border-sunshine"
                initial={{ scale: 0.5, opacity: 0.9 }}
                animate={{ scale: 1.35, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            ) : null}
          </AnimatePresence>
        </button>

        {showLabel ? (
          <span
            aria-hidden="true"
            className={cn(
              "text-xs font-semibold",
              variant === "overlay"
                ? "text-card drop-shadow-[0_1px_4px_rgb(4_38_102/0.6)] md:text-ink md:drop-shadow-none"
                : "text-ink",
            )}
          >
            {liked ? "Liked" : "Like"}
          </span>
        ) : null}
      </span>

      <span
        role="status"
        className={cn(
          "pointer-events-none absolute top-full right-0 z-20 mt-2 w-max max-w-56 rounded-md bg-ink px-3 py-2 text-xs text-card shadow-float transition-opacity duration-200",
          error ? "opacity-100" : "opacity-0",
        )}
      >
        {error ?? ""}
      </span>
    </span>
  );
});

export default LikeButton;
