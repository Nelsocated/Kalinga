export type ExplorePet = {
  id: string;
  name: string | null;
  shelter: {
    shelter_name?: string | null;
  } | null;
  pet_media: {
    type: "video" | "photo";
    url: string;
    caption: string | null;
  }[];
};
