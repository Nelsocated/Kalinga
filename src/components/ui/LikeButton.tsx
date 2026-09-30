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
import { Heart } from "@phosphor-icons/react";
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
  className?: string;
};

const BURST = [0, 60, 120, 180, 240, 300];

/**
 * Heart toggle with a spring and a small burst when liked.
 * The ref's like() only ever likes, for double-tap on the feed.
 */
const LikeButton = forwardRef<LikeHandle, Props>(function LikeButton(
  { targetType, targetId, size = "md", className },
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

  const px = size === "lg" ? 32 : 26;
  const animate = pulse > 0 && !reduce;

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setTo(!liked)}
        disabled={!ready}
        aria-pressed={liked}
        aria-label={liked ? "Unlike" : "Like"}
        className={cn(
          "relative flex size-12 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-sunshine-wash disabled:cursor-default disabled:opacity-60",
          className,
        )}
      >
        <motion.span
          key={pulse}
          initial={animate ? { scale: liked ? 0.4 : 1.15 } : false}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 14 }}
          className={cn("flex", liked && "text-sunshine-deep")}
        >
          <Heart size={px} weight={liked ? "fill" : "regular"} aria-hidden="true" />
        </motion.span>

        <AnimatePresence>
          {liked && animate ? (
            <span key={pulse} aria-hidden="true" className="pointer-events-none absolute inset-0">
              {BURST.map((deg) => (
                <motion.span
                  key={deg}
                  className="absolute top-1/2 left-1/2 size-1.5 rounded-full bg-sunshine"
                  initial={{ x: "-50%", y: "-50%", opacity: 1, scale: 1 }}
                  animate={{
                    x: `calc(-50% + ${Math.cos((deg * Math.PI) / 180) * 26}px)`,
                    y: `calc(-50% + ${Math.sin((deg * Math.PI) / 180) * 26}px)`,
                    opacity: 0,
                    scale: 0.4,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </span>
          ) : null}
        </AnimatePresence>
      </button>

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
