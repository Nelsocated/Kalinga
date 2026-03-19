"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/layout/NavBar";

const HIDDEN_ROUTES = new Set(["/site/login", "/site/signup"]);

export default function NavBarGate() {
  const pathname = usePathname();
  const isHiddenRoute = !pathname || HIDDEN_ROUTES.has(pathname);
  const isSiteRoute = pathname?.startsWith("/site/") ?? false;

  if (!isSiteRoute || isHiddenRoute) {
    return null;
  }

  return <NavBar />;
}
