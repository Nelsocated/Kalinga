import Navbar from "@/components/layout/NavBar";
import "./globals.css";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="bg-background flex min-h-screen">
        <aside className="w-56 shrink-0 flex pl-20 pt-15">
          <Navbar />
        </aside>

        <main className="flex-1 min-w-0 px-4 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
