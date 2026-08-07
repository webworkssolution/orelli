import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
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

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Orelli Bombay | Premium Luxury Textiles",
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
      <body className={`${cormorant.variable} ${dmSans.variable} font-sans antialiased bg-background text-foreground`}>
        <ModalProvider>
          <LayoutShell categories={categories}>{children}</LayoutShell>
          <StickyActionBar />
        </ModalProvider>
      </body>
    </html>
  );
}

