import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Libre_Baskerville, Jost } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";
import { ModalProvider } from "@/components/context/ModalContext";
import StickyActionBar from "@/components/layout/StickyActionBar";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

// Brand wordmark font (Baskerville revival) used for the ORELLI BOMBAY logo
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-baskerville",
});

// Geometric sans (Century Gothic substitute) used for the BOMBAY wordmark
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-gothic",
});

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Orelli Bombay | Bespoke Home Furnishing",
  description: "Crafted for the spaces you live in. Where Indian craft meets contemporary living.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch active categories for the navigation sub-menu
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { title: true, slug: true },
  });

  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable} ${libreBaskerville.variable} ${jost.variable} font-sans antialiased bg-background text-foreground`}>
        <ModalProvider>
          <LayoutShell categories={categories}>{children}</LayoutShell>
          <StickyActionBar />
        </ModalProvider>
      </body>
    </html>
  );
}

