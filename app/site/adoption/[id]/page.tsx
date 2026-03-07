import AdoptionApplicationForm from "@/components/explore/AdoptionApplicationForm";

export default async function AdoptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AdoptionApplicationForm
      petId={id}
    />
  );
}
