import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import { Spectral } from "next/font/google";
import SmoothScroller from "./animations/SmoothScroller";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import WebGL_Gradient from "./components/WebGL_Gradient/WebGL_Gradient";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["monospace"],
  subsets: ["latin"],
  weight: ["400"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["serif"],
  subsets: ["latin"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["serif"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ramneek Singh | Creative Developer",
    template: "%s | Ramneek Singh"
  },
  description: "Computer Science student and Creative Developer crafting immersive digital experiences with React, Next.js, and WebGL.",
  keywords: ["Creative Developer", "Portfolio", "Ramneek Singh", "Web Developer", "Next.js", "React", "WebGL", "Three.js", "Lethbridge"],
  authors: [{ name: "Ramneek Singh", url: "https://ramneeksingh.ca" }],
  creator: "Ramneek Singh",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://ramneeksingh.ca",
    title: "Ramneek Singh | Creative Developer",
    description: "Immersive portfolio featuring WebGL, GSAP animations, and interactive design.",
    siteName: "Ramneek Singh Portfolio",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Ramneek Singh Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ramneek Singh | Creative Developer",
    description: "Immersive portfolio featuring WebGL, GSAP animations, and interactive design.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexMono.variable} ${cormorant.variable} ${spectral.variable}`}>
        <CustomCursor />
        <WebGL_Gradient />
        <SmoothScroller>
          {children}
        </SmoothScroller>
      </body>
    </html>
  );
}