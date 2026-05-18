import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyActionBar from "@/components/layout/StickyActionBar";
import { ModalProvider } from "@/components/context/ModalContext";

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

export const metadata: Metadata = {
  title: "Orelli Bombay | Premium Luxury Textiles",
  description: "Crafted for the spaces you live in. Where Indian craft meets contemporary living.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable} font-sans antialiased bg-background text-foreground`}>
        <ModalProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <StickyActionBar />
        </ModalProvider>
      </body>
    </html>
  );
}
