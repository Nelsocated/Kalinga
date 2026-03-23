// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Kalinga",
  description: "Pet Adoption Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
