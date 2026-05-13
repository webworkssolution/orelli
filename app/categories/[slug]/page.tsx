"use client";

import { useState } from "react";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";

const IMAGES = [
  "https://picsum.photos/seed/prodmain/1000/1000",
  "https://picsum.photos/seed/prodthumb1/1000/1000",
  "https://picsum.photos/seed/prodthumb2/1000/1000",
  "https://picsum.photos/seed/prodthumb3/1000/1000",
];

const SWATCHES = ["#d2b48c", "#a0522d", "#556b2f", "#2f4f4f"];

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeSwatch, setActiveSwatch] = useState(0);

  return (
    <div className="min-h-screen bg-background pt-[72px]">
      <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-72px)]">
        
        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col gap-4">
          <FadeUp>
            <div className="w-full aspect-square bg-border rounded-[4px] overflow-hidden relative">
              {IMAGES.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`Product view ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    index === activeImage ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-4 mt-4">
              {IMAGES.map((src, index) => (
                <button
                  key={src}
                  onClick={() => setActiveImage(index)}
                  className={`w-[72px] aspect-square rounded-[2px] overflow-hidden border-[1.5px] transition-colors ${
                    index === activeImage ? "border-accent" : "border-border hover:border-foreground"
                  }`}
                >
                  <img src={src} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Right: Info Panel */}
        <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col justify-center">
          <FadeUp delay={0.1}>
            <div className="font-sans text-[12px] text-[#888] mb-6">
              <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
              <span className="mx-2">/</span>
              <span>Upholstery</span>
              <span className="mx-2">/</span>
              <span className="text-foreground capitalize">{params.slug.replace(/-/g, " ")}</span>
            </div>

            <h1 className="font-cormorant text-[clamp(28px,3vw,44px)] text-foreground leading-tight mb-2 capitalize">
              {params.slug.replace(/-/g, " ")}
            </h1>
            
            <div className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888]">
              HANDWOVEN &middot; UPHOLSTERY &middot; NATURAL FIBRE
            </div>

            <div className="w-full h-[1px] bg-border my-5" />

            <p className="font-sans text-[14px] text-[#555] leading-[1.8] mb-8">
              Woven on traditional looms by master artisans, this textile brings exceptional tactile richness and enduring strength. Ideal for high-use residential seating and statement pieces, it softens beautifully with age while maintaining its structured weave.
            </p>

            <div className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] mb-4">
              SPECIFICATIONS
            </div>

            <div className="flex flex-col gap-2 mb-8 border-t border-border pt-4">
              {[
                { label: "Material", value: "60% Cotton, 40% Raw Silk" },
                { label: "Width", value: "140 cm / 55 in" },
                { label: "Pattern", value: "Textured Solid" },
                { label: "Lead Time", value: "4-6 weeks" },
                { label: "Finish", value: "Uncalendered" },
              ].map((spec) => (
                <div key={spec.label} className="flex border-b border-border pb-2">
                  <span className="font-sans text-[13px] text-[#888] w-[140px]">{spec.label}</span>
                  <span className="font-sans text-[13px] text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="font-sans uppercase tracking-[0.12em] text-[11px] text-[#888] mb-4">
              COLOURWAYS
            </div>

            <div className="flex gap-4 mb-10">
              {SWATCHES.map((color, idx) => (
                <button
                  key={color}
                  onClick={() => {
                    setActiveSwatch(idx);
                    setActiveImage(idx % IMAGES.length); // mock tying swatch to image
                  }}
                  className={`w-[36px] h-[36px] rounded-full transition-all ${
                    idx === activeSwatch
                      ? "border-2 border-foreground outline outline-2 outline-offset-1 outline-background"
                      : "border border-border hover:border-foreground"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select colorway ${idx + 1}`}
                />
              ))}
            </div>

            <Link href={`/contact?product=${params.slug}`} className="btn-filled w-full text-center block mb-4">
              ENQUIRE
            </Link>
            <p className="font-sans text-[12px] text-[#888] text-center">
              Custom orders welcome. Lead time 4–6 weeks.
            </p>
          </FadeUp>
        </div>

      </div>
    </div>
  );
}
