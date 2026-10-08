import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kalinga",
    short_name: "Kalinga",
    description: "Give Care. Give Love. A Home for Every Paw",
    start_url: "/site/home",
    display: "standalone",
    // Ground and Sunshine tokens; the manifest needs literal colors.
    background_color: "#fff9ed",
    theme_color: "#f3be0f",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
