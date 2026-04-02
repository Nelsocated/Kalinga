// app/admin/layout.tsx
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminQuickActions from "@/components/admin/AdminQuickActions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="ml-20 shrink-0 flex pt-13">
        <AdminNavbar />
      </aside>
      <main className="flex-1 min-w-0">{children}</main>

      {/* Fixed top-right quick action buttons */}
      <AdminQuickActions />
    </div>
  );
}