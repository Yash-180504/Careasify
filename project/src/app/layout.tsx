import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: {
    default: "Careasify — Premium Doorstep Car Wash & Detailing Service in India",
    template: "%s | Careasify",
  },
  description:
    "India's #1 eco-friendly doorstep car wash & detailing service. Waterless cleaning, trained professionals, 10,000+ happy customers. Book now or contact us for custom pricing. Available in Bangalore, Mumbai, Delhi NCR, Hyderabad & Pune.",
  keywords: [
    "car wash near me",
    "doorstep car wash",
    "car detailing service",
    "waterless car wash",
    "eco-friendly car wash",
    "car cleaning at home",
    "car wash Bangalore",
    "car wash Mumbai",
    "car wash Delhi",
    "car wash subscription",
    "premium car detailing",
    "mobile car wash",
    "car wash service India",
    "Careasify",
    "best car wash service",
    "professional car cleaning",
    "car spa near me",
    "car interior cleaning",
    "car exterior wash",
    "ceramic coating car",
  ],
  manifest: "/manifest.json",
  metadataBase: new URL("https://careasify.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://careasify.com",
    siteName: "Careasify",
    title: "Careasify — Premium Doorstep Car Wash & Detailing Service",
    description:
      "Professional eco-friendly car wash at your doorstep. Waterless cleaning, trained professionals, 4.9★ rated. 10,000+ happy car owners. Contact us for custom pricing.",
    images: [
      {
        url: "/images/hero.png",
        width: 1200,
        height: 630,
        alt: "Careasify professional car wash team in purple uniforms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careasify — Premium Doorstep Car Wash & Detailing",
    description:
      "Eco-friendly doorstep car wash. Waterless cleaning, 4.9★ rated, 10,000+ happy customers. Contact us today!",
    images: ["/images/hero.png"],
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Careasify",
  },
  category: "automotive",
  verification: {
    google: "TrDdwJhk3616xV00e9VGRUb4EYX4s58ZmNBKyxs2OCM",
  },
  icons: {
    icon: "/icons/careas-logo.png",
    shortcut: "/icons/careas-logo.png",
    apple: "/icons/icon-512.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Careasify",
    description: "Premium doorstep car wash and detailing service in India. Eco-friendly waterless cleaning by trained professionals.",
    url: "https://careasify.com",
    logo: "https://careasify.com/icons/careas-logo.png",
    image: "https://careasify.com/images/hero.png",
    telephone: "+91-70220-99595",
    email: "support@careasify.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "12.9716",
      longitude: "77.5946",
    },
    areaServed: ["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Pune"],
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "10000",
      bestRating: "5",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "07:00",
      closes: "21:00",
    },
    sameAs: [],
    serviceType: ["Car Wash", "Car Detailing", "Car Interior Cleaning", "Ceramic Coating"],
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
