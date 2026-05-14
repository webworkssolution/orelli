import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";

export default function FeaturedProject() {
  return (
    <section className="bg-background py-0">
      {/* First Feature: Image Left, Text Right */}
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-5/12 aspect-square md:aspect-auto">
          <img
            src="/outdoor.jpeg"
            alt="The Malabar Series"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-7/12 flex items-center p-8 md:px-16 md:py-24 lg:px-24">
          <FadeUp>
            <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] block mb-4">
              FEATURED PROJECT
            </span>
            <h2 className="font-cormorant text-[clamp(28px,3vw,48px)] text-foreground mb-4 leading-tight">
              The Malabar Series
            </h2>
            <p className="font-sans text-[15px] text-[#555] leading-[1.7] max-w-[480px] line-clamp-3">
              Inspired by the coastal landscapes of Southern India. This collection features lightweight hand-spun cotton and raw silk blends, perfect for tropical climates.
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="w-full h-[1px] bg-border" />

      {/* Second Feature: Text Left, Image Right */}
      <div className="flex flex-col md:flex-row-reverse w-full">
        <div className="w-full md:w-5/12 aspect-square md:aspect-auto">
          <img
            src="/upholstery.jpeg"
            alt="Heritage Weaves"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-7/12 flex items-center p-8 md:px-16 md:py-24 lg:px-24">
          <FadeUp>
            <span className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] block mb-4">
              FEATURED PROJECT
            </span>
            <h2 className="font-cormorant text-[clamp(28px,3vw,48px)] text-foreground mb-4 leading-tight">
              Heritage Weaves
            </h2>
            <p className="font-sans text-[15px] text-[#555] leading-[1.7] max-w-[480px] line-clamp-3">
              Reviving centuries-old weaving techniques. Heavy brocades and textured jacquards that bring a sense of history and depth to contemporary interiors.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
