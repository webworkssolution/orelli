import { Metadata } from "next";
import FadeUp from "@/components/ui/FadeUp";
import FaqAccordion from "./FaqAccordion";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ | Orelli Bombay",
  description: "Frequently asked questions about Orelli Bombay textiles, bespoke orders, and care instructions.",
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <FadeUp className="w-full text-center mb-16">
          <h1 className="font-cormorant text-[clamp(48px,6vw,80px)] text-foreground leading-none mb-6">
            Frequently Asked Questions
          </h1>
          <p className="font-sans text-[16px] text-[#555] max-w-2xl mx-auto">
            Find answers to common questions about our handwoven textiles, ordering process, and care guidelines.
          </p>
        </FadeUp>
        
        <FaqAccordion faqs={faqs} />
      </div>
    </div>
  );
}
