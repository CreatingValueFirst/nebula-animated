import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
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
  metadataBase: new URL('https://heaveninteractive.net'),
  title: "Heaven Interactive -- Artificial Intelligence Services",
  description:
    "Where Intelligence Meets the Infinite. Enterprise AI solutions including custom model training, conversational agents, computer vision, predictive analytics, and AI strategy consulting.",
  keywords: [
    "artificial intelligence",
    "AI services",
    "machine learning",
    "neural networks",
    "computer vision",
    "conversational AI",
    "predictive analytics",
    "AI consulting",
    "heaven interactive",
  ],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/favicon.ico' },
    ],
  },
  openGraph: {
    title: "Heaven Interactive -- Artificial Intelligence Services",
    description:
      "Where Intelligence Meets the Infinite. Enterprise AI solutions for the world's most ambitious companies.",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heaven Interactive -- Artificial Intelligence Services",
    description:
      "Where Intelligence Meets the Infinite. Enterprise AI solutions for the world's most ambitious companies.",
    images: ["/og-image.jpg"],
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
        <Navigation />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
