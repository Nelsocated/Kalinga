import Navbar from "@/src/components/layout/NavBar";
import BottomTabBar from "@/src/components/layout/BottomTabBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <Navbar />
      <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
      <BottomTabBar />
    </div>
  );
}
