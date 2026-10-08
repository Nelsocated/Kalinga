import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin", "latin-ext"],
  variable: "--font-rubik",
  display: "swap",
});

const title = "Kalinga | Give Care. Give Love. A Home for Every Paw";

const description =
  "Watch short videos of rescued dogs and cats from verified shelters, " +
  "save the pets you love, and apply to adopt on Kalinga.";

// Icons come from the paw logo: src/app/icon.svg (favicon) and src/app/apple-icon.tsx
export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | Kalinga",
  },
  description,
  applicationName: "Kalinga",
  manifest: "/manifest.webmanifest",
  keywords: [
    "pet adoption",
    "adopt a dog",
    "adopt a cat",
    "animal shelter",
    "rescue pets",
  ],
  openGraph: {
    type: "website",
    siteName: "Kalinga",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export const viewport: Viewport = {
  // Sunshine token; browser chrome needs a literal color.
  themeColor: "#f3be0f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={rubik.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
