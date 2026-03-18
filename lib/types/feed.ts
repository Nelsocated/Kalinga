export type FeedMedia = {
  id: string;
  type: "photo" | "video";
  url: string | null;
  caption: string | null;
};

export type FeedShelter = {
  id: string;
  shelter_name: string | null;
  logo_url?: string | null;
};

export type FeedItem = {
  id: string;
  name: string;
  pet_media: FeedMedia[];
  shelter: FeedShelter | null;
};
