import "./globals.css";

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

export const metadata = {
  title: "Kalinga",
  description: "Pet adoption platform",
  icons: {
    icon: "/kalinga_logo(ver2).svg",
  },
};
