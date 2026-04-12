import Navbar from "@/components/layout/NavBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="ml-20 shrink-0 flex pt-13">
        <Navbar />
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
