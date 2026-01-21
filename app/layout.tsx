import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ConditionalWhatsApp } from "@/components/conditional-whatsapp";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Nova - Perfumería y Cuidado Personal",
    template: "%s | Nova",
  },
  description:
    "Descubre los mejores productos de perfumería y cuidado personal en Nova. Perfumes, cremas, shampoos y más. Compra fácil por WhatsApp.",
  keywords: [
    "perfumería",
    "cuidado personal",
    "perfumes",
    "cremas",
    "shampoo",
    "cosméticos",
    "belleza",
    "Nova",
  ],
  authors: [{ name: "Nova" }],
  creator: "Nova",
  publisher: "Nova",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Nova - Perfumería y Cuidado Personal",
    description:
      "Descubre los mejores productos de perfumería y cuidado personal en Nova.",
    url: "/",
    siteName: "Nova",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nova - Perfumería y Cuidado Personal",
    description:
      "Descubre los mejores productos de perfumería y cuidado personal en Nova.",
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
