import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "RapYard",
  description:
    "Your room. Your take. Your sound.",
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: Props) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}