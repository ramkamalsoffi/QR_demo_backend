import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QR Demo Backend",
  description: "Backend API for QR Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

