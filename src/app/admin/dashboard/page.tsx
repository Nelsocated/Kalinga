import AdminDashboardClient from "./AdminDashboardClient";
import { getShelterApplications } from "@/src/lib/services/adminService";
import type { ShelterApplicationItem } from "@/src/lib/services/adminService";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/src/lib/utils/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/site/home");
  }

  let applications: ShelterApplicationItem[] = [];
  let initialError: string | null = null;

  try {
    applications = await getShelterApplications("all");
  } catch (error) {
    initialError =
      error instanceof Error
        ? error.message
        : "Failed to fetch shelter applications.";
  }

  return (
    <AdminDashboardClient
      initialApplications={applications}
      initialError={initialError}
    />
  );
}
