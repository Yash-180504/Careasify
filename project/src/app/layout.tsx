import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "Careasify — Premium Car Wash & Detailing at Your Doorstep",
  description: "Book eco-friendly car wash services on-demand or subscribe for daily, alternate day, or weekly cleaning. Professional doorstep car care at affordable prices.",
  keywords: "car wash, car detailing, doorstep car wash, car cleaning, subscription car wash, eco-friendly car wash",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Careasify",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <Providers>
          {children}
          <PWARegister />
        </Providers>
      </body>
    </html>
  );
}
