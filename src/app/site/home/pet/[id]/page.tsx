// app/site/home/pet/[id]/page.tsx
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/site/home/pet?media=${id}`);
}
