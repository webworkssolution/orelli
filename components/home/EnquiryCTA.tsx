"use client";

import { useState } from "react";
import FadeUp from "@/components/ui/FadeUp";
import EnquiryModal from "@/components/layout/EnquiryModal";

export default function EnquiryCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="bg-background py-32 px-6 md:px-12 border-t border-border flex flex-col items-center text-center">
        <FadeUp className="flex flex-col items-center">
          <h2 className="font-cormorant text-[clamp(32px,4vw,56px)] text-foreground mb-4 leading-tight">
            Have a project in mind?
          </h2>
          <p className="font-sans text-[15px] text-[#555] mb-10 max-w-[500px]">
            We work with architects, interior designers, and discerning homeowners.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn-outline uppercase tracking-[0.15em]">
            GET IN TOUCH
          </button>
        </FadeUp>
      </section>

      <EnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
