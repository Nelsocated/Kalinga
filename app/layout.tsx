import NavBarGate from "../components/layout/NavBarGate";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex bg-gray-100">
        <NavBarGate />
        <main className="flex-1 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}