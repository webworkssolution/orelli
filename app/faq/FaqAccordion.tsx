"use client";

import { useState } from "react";
import FadeUp from "@/components/ui/FadeUp";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface FaqAccordionProps {
  faqs: FAQ[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {faqs.map((faq, index) => (
        <FadeUp key={index} delay={index * 0.1}>
          <div className="border-b border-border py-6">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left focus:outline-none"
            >
              <h3 className="font-cormorant text-2xl md:text-3xl text-foreground pr-8">
                {faq.question}
              </h3>
              <span className={`flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
              }`}
            >
              <p className="font-sans text-[18px] text-[#555] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
