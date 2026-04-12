import { notFound } from "next/navigation";
import { getShelterApplicationById } from "@/src/lib/services/adminService";
import ReviewApplicationClient from "./ReviewApplicationClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function ApplicationPage({ params }: PageProps) {
  const { id } = await params;

  const result = await getShelterApplicationById(id);

  if (!result.data) {
    notFound();
  }

  return <ReviewApplicationClient initialData={result.data} />;
}
