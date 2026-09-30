import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin", "latin-ext"],
  variable: "--font-rubik",
  display: "swap",
});

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
    <html lang="en" className={rubik.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
