import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rapyard.club"),

  title: {
    default: "RapYard",
    template: "%s | RapYard",
  },

  description:
    "Create. Collaborate. Compete. RapYard is the platform where artists record, connect, battle, and build their legacy.",

  applicationName: "RapYard",

  keywords: [
    "RapYard",
    "music",
    "hip hop",
    "rap",
    "recording",
    "beats",
    "artists",
    "music collaboration",
    "battle rap",
    "music community",
  ],

  authors: [
    {
      name: "RapYard",
    },
  ],

  creator: "RapYard",
  publisher: "RapYard",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "RapYard",
    description:
      "Create. Collaborate. Compete. Build your legacy.",

    url: "https://rapyard.app",

    siteName: "RapYard",

    type: "website",

    locale: "en_US",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RapYard",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "RapYard",

    description:
      "Create. Collaborate. Compete. Build your legacy.",

    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          bg-black
          text-white
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}