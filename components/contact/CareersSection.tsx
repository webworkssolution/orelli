"use client";

import React, { useState } from "react";
import FadeUp from "../ui/FadeUp";
import CareersModal from "./CareersModal";

export default function CareersSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <FadeUp delay={0.2} className="h-full flex flex-col justify-center max-w-sm">
        <span className="font-sans uppercase tracking-[0.12em] text-[13px] text-[#888] block mb-4">
          CAREERS
        </span>
        <h2 className="font-cormorant text-[36px] md:text-[42px] text-foreground leading-[1.1] mb-6">
          Careers at Orelli
        </h2>
        <p className="font-sans text-[17px] text-[#555] leading-[1.8] mb-10">
          We are always looking for passionate, detail-oriented individuals to join our growing studio. If you have a deep appreciation for textile heritage and contemporary design, we would love to hear from you.
        </p>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-outline w-fit bg-black text-white hover:bg-black/80 hover:text-white"
        >
          Apply Now
        </button>
      </FadeUp>

      <CareersModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
