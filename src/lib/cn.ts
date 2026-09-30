import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the project's custom text sizes so they don't get
// mistaken for text colors (e.g. text-description vs text-ink).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "headline",
            "header",
            "name",
            "subheader",
            "title",
            "subtitle",
            "description",
            "small",
          ],
        },
      ],
    },
  },
});

/** Joins class names and lets later Tailwind classes override earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
