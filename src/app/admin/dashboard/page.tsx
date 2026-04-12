import AdminDashboardClient from "./AdminDashboardClient";
import { getShelterApplications } from "@/src/lib/services/adminService";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const result = await getShelterApplications("all");

  return (
    <AdminDashboardClient
      initialApplications={result.data ?? []}
      initialError={result.ok ? null : result.error}
    />
  );
}
