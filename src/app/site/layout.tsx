import Navbar from "@/src/components/layout/NavBar";
import BottomTabBar from "@/src/components/layout/BottomTabBar";
import { getAuthUser } from "@/src/lib/utils/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read on the server so the nav's account links are right on the first paint
  const user = await getAuthUser();

  return (
    <div className="flex min-h-dvh">
      <Navbar user={user} />
      <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
      <BottomTabBar user={user} />
    </div>
  );
}
