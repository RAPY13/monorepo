import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RapYard",
  description: "Creators build the yard.",
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