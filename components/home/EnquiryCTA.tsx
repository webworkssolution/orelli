"use client";

import FadeUp from "@/components/ui/FadeUp";
import { useModal } from "@/components/context/ModalContext";

export default function EnquiryCTA() {
  const { openModal } = useModal();

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
          <button onClick={openModal} className="btn-outline uppercase tracking-[0.15em]">
            GET IN TOUCH
          </button>
        </FadeUp>
      </section>
    </>
  );
}
