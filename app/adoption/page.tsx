import AdoptionApplicationForm from "@/components/explore/AdoptionApplicationForm";

type AdoptionPageProps = {
  searchParams: Promise<{
    petId?: string;
    petName?: string;
    shelterName?: string;
  }>;
};

export default async function AdoptionPage({ searchParams }: AdoptionPageProps) {
  const params = await searchParams;

  const petId = params.petId?.trim() || "unknown-pet";
  const petName = params.petName?.trim() || "Pet Name";
  const shelterName = params.shelterName?.trim() || "Shelter Name";

  return (
    <AdoptionApplicationForm
      petId={petId}
      petName={petName}
      shelterName={shelterName}
    />
  );
}
