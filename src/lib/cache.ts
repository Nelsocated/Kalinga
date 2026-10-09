import "server-only";
import { revalidateTag } from "next/cache";

/** Tags on cached public lists; a write clears the lists that show what it changed. */
export const CACHE_TAGS = {
  pets: "pets",
  shelters: "shelters",
  fosters: "fosters",
} as const;

type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Public lists are shared by every visitor for up to a minute. */
export const PUBLIC_LIST_SECONDS = 60;

/** Expires the tagged lists now, so the next visit reads fresh data. */
export function invalidate(...tags: CacheTag[]) {
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
}
