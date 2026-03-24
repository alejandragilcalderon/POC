import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APOD API",
  description: "NASA APOD REST proxy",
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
