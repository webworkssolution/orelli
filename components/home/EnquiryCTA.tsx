"use client";

import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";

export default function EnquiryCTA() {

  return (
    <>
      <section className="bg-background py-16 px-6 md:px-12 border-t border-border flex flex-col items-center text-center">
        <FadeUp className="flex flex-col items-center">
          <h2 className="font-cormorant text-[clamp(32px,4vw,56px)] text-foreground mb-4 leading-tight">
            Have a project in mind?
          </h2>
          <p className="font-sans text-[17px] text-[#555] mb-10 max-w-[500px]">
            We work with architects, interior designers, and discerning homeowners.
          </p>
          <Link href="/enquiry" className="btn-outline uppercase tracking-[0.15em]">
            GET IN TOUCH
          </Link>
        </FadeUp>
      </section>
    </>
  );
}
