import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEBULA -- Cinematic Space Animations",
  description:
    "Explore the Elephant's Trunk Nebula through programmatic cinematic animations built with Remotion, Next.js, and Framer Motion.",
  keywords: [
    "nebula",
    "space animation",
    "remotion",
    "cinematic",
    "deep space",
    "IC 1396",
    "elephants trunk nebula",
  ],
  openGraph: {
    title: "NEBULA -- Cinematic Space Animations",
    description:
      "Explore the Elephant's Trunk Nebula through programmatic cinematic animations.",
    type: "website",
    images: ["/nebula.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEBULA -- Cinematic Space Animations",
    description:
      "Explore the Elephant's Trunk Nebula through programmatic cinematic animations.",
    images: ["/nebula.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="min-h-dvh flex flex-col bg-[#0a0a0f] antialiased">
        {children}
      </body>
    </html>
  );
}
