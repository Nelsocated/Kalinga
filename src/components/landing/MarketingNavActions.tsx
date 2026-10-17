"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LinkButton } from "@/src/components/ui/Button";
import { readSessionUser } from "@/src/components/layout/useNavUser";
import type { AuthUser } from "@/src/lib/utils/clientAuth";

const loginLink = "whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium text-ink hover:bg-sunshine-wash sm:px-3";

/**
 * Signed out: Log in and Start watching. Signed in: one way back into the app, the For You
 * feed (shelters and admins go to their dashboard). Read from the browser session so the
 * marketing pages stay static; the Log in slot holds its width while the session is checked.
 */
export default function MarketingNavActions() {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    readSessionUser()
      .catch(() => null)
      .then((u) => {
        if (!cancelled) setUser(u);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (user) {
    const dashboard = user.role === "admin" ? "/admin/dashboard" : user.role === "shelter" ? "/shelter/dashboard" : null;
    return (
      <LinkButton href={dashboard ?? "/site/home"} variant="primary" size="sm">
        {dashboard ? "Back to dashboard" : "Back to For You"}
      </LinkButton>
    );
  }

  return (
    <>
      {user === undefined ? (
        <span aria-hidden="true" className={`${loginLink} invisible`}>
          Log in
        </span>
      ) : (
        <Link href="/login" className={loginLink}>
          Log in
        </Link>
      )}
      <LinkButton href="/site/home" variant="primary" size="sm">
        Start watching
      </LinkButton>
    </>
  );
}
