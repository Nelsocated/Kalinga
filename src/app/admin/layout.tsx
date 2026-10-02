import { requireAdmin } from "@/src/lib/utils/auth";
import { redirect } from "next/navigation";
import type { AuthUser } from "@/src/lib/utils/clientAuth";
import Navbar from "@/src/components/layout/NavBar";
import BottomTabBar from "@/src/components/layout/BottomTabBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: AuthUser;
  try {
    user = await requireAdmin();
  } catch {
    redirect("/site/home");
  }

  return (
    <div className="flex min-h-dvh">
      <Navbar user={user} />
      <main className="relative min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
      <BottomTabBar user={user} />
    </div>
  );
}
