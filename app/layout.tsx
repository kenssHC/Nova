import type { Metadata } from "next";
import { Inter, Parisienne } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ConditionalWhatsApp } from "@/components/conditional-whatsapp";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const parisienne = Parisienne({ 
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-parisienne",
});

export const metadata: Metadata = {
  title: {
    default: "Oasis de Fragancias - Perfumería y Cuidado Personal",
    template: "%s | Oasis de Fragancias",
  },
  description:
    "Descubre los mejores productos de perfumería y cuidado personal en Oasis de Fragancias. Perfumes, cremas, shampoos y más. Compra fácil por WhatsApp.",
  keywords: [
    "perfumería",
    "cuidado personal",
    "perfumes",
    "cremas",
    "shampoo",
    "cosméticos",
    "belleza",
    "Oasis de Fragancias",
  ],
  authors: [{ name: "Oasis de Fragancias" }],
  creator: "Oasis de Fragancias",
  publisher: "Oasis de Fragancias",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Oasis de Fragancias - Perfumería y Cuidado Personal",
    description:
      "Descubre los mejores productos de perfumería y cuidado personal en Oasis de Fragancias.",
    url: "/",
    siteName: "Oasis de Fragancias",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oasis de Fragancias - Perfumería y Cuidado Personal",
    description:
      "Descubre los mejores productos de perfumería y cuidado personal en Oasis de Fragancias.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Parisienne&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <ConditionalWhatsApp />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
