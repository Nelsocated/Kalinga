type FeedItem = {
  id: string;
  name: string;
  description: string | null;
  pet_media: { type: "video" | "photo"; url: string }[];
  shelter: null | {
    shelter_name?: string | null;
    logo_url?: string | null;
  };
};

export default function PetCard({ item }: { item: FeedItem }) {
  const video = item.pet_media?.find((m) => m.type === "video")?.url;

  return (
    <div>
      <div className="w-full h-full relative">
        {video ? (
          <video
            src={video}
            className="h-full w-full object-cover"
            muted
            playsInline
            loop
            autoPlay
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/70">
            No video
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="text-lg font-semibold">{item.name}</div>
        {item.description && <p className="text-m">{item.description}</p>}
      </div>
    </div>
  );
}
