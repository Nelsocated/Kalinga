import { requireAdmin } from "@/src/lib/utils/auth";
import { redirect } from "next/navigation";
import Navbar from "@/src/components/layout/NavBar";

export default async function ShelterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect("/site/home");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="ml-20 shrink-0 flex pt-13">
        <Navbar />
      </aside>
      <main className="relative flex-1 min-w-0">{children}</main>
    </div>
  );
}
