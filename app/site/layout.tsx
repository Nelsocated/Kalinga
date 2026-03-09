import Navbar from "@/components/layout/NavBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 flex pl-20 pt-15">
        <Navbar />
      </aside>
      <main className="flex-1 min-w-0 px-4 lg:px-8">{children}</main>
    </div>
  );
}
