import type { Metadata, Viewport } from "next";
import "./globals.css";

const description =
  "Kalinga helps rescued dogs and cats find a home. Watch short videos from " +
  "partner shelters, save the pets you love, and apply to adopt.";

// The favicon comes from src/app/icon.svg
export const metadata: Metadata = {
  title: {
    default: "Kalinga · Pet Adoption",
    template: "%s · Kalinga",
  },
  description,
  applicationName: "Kalinga",
  keywords: [
    "pet adoption",
    "adopt a dog",
    "adopt a cat",
    "animal shelter",
    "rescue pets",
    "Philippines",
  ],
  openGraph: {
    type: "website",
    siteName: "Kalinga",
    title: "Kalinga · Pet Adoption",
    description,
  },
  twitter: {
    card: "summary",
    title: "Kalinga · Pet Adoption",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f3be0f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-outerbg min-h-screen">{children}</body>
    </html>
  );
}
