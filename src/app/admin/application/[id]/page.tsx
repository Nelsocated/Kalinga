import { notFound, redirect } from "next/navigation";
import { getShelterApplicationById } from "@/src/lib/services/adminService";
import { requireAdmin } from "@/src/lib/utils/auth";
import { ApiError } from "@/src/lib/api";
import ReviewApplicationClient from "./ReviewApplicationClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

async function getApplicationOrNotFound(id: string) {
  try {
    return await getShelterApplicationById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export default async function ApplicationPage({ params }: PageProps) {
  // The layout checks too, but signed document links must never be
  // created without an admin session
  try {
    await requireAdmin();
  } catch {
    redirect("/site/home");
  }

  const { id } = await params;

  const application = await getApplicationOrNotFound(id);

  return <ReviewApplicationClient initialData={application} />;
}
