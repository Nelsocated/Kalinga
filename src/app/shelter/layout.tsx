import { requireShelter } from "@/src/lib/utils/auth";
import { redirect } from "next/navigation";
import Navbar from "@/src/components/layout/NavBar";
import BottomTabBar from "@/src/components/layout/BottomTabBar";

export default async function ShelterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireShelter();
  } catch {
    redirect("/site/home");
  }

  return (
    <div className="flex min-h-dvh">
      <Navbar />
      <main className="relative min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
      <BottomTabBar />
    </div>
  );
}
