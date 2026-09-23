import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { siteUrl } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "TreeScore — How green is your neighbourhood?",
    template: "%s — TreeScore",
  },
  description:
    "Satellite-derived green cover estimates for TreeScore-defined Mumbai analysis areas. Measure first. Claim later.",
  manifest: "/manifest.webmanifest",
  applicationName: "TreeScore",
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "TreeScore",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "TreeScore — How green is your neighbourhood?",
    description:
      "Measure India's urban green cover clearly, honestly and consistently. Starting with Mumbai.",
    siteName: "TreeScore",
    type: "website",
    url: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f3a2d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ServiceWorkerRegistration />
        <Navigation />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
