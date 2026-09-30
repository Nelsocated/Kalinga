"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/src/lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (it stays available to screen readers). */
  hideTitle?: boolean;
  children: React.ReactNode;
  /** Footer actions, right-aligned. */
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog: focus trap, Escape to close, scroll lock, focus return.
 * Centered card on larger screens, bottom sheet on phones.
 */
export default function Modal({
  open,
  onClose,
  title,
  hideTitle = false,
  children,
  footer,
  className,
  bodyClassName,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== "Tab" || !panel) return;

      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;

      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cn(
              "relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-xl bg-card shadow-float outline-none",
              "sm:max-w-lg sm:rounded-xl",
              className,
            )}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <header
              className={cn(
                "flex items-center justify-between gap-4 px-6 pt-5",
                hideTitle ? "pb-0" : "pb-3",
              )}
            >
              <h2
                id={titleId}
                className={cn(
                  "text-xl font-semibold text-ink",
                  hideTitle && "sr-only",
                )}
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 ml-auto flex size-10 items-center justify-center rounded-full text-xl text-ink transition-colors hover:bg-sunshine-wash"
              >
                <X aria-hidden="true" />
              </button>
            </header>

            <div
              className={cn(
                "scroll-stable overflow-y-auto px-6 pb-6",
                bodyClassName,
              )}
            >
              {children}
            </div>

            {footer ? (
              <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-line px-6 py-4">
                {footer}
              </footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
