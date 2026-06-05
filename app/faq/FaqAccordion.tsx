"use client";

import { useState } from "react";
import FadeUp from "@/components/ui/FadeUp";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What materials are used in your textiles?",
    answer: "Our textiles are handwoven using natural fibers such as cotton, linen, silk, and wool. We prioritize sustainable and high-quality yarns to ensure durability and a premium feel.",
  },
  {
    question: "Do you offer custom or bespoke designs?",
    answer: "Yes, we collaborate closely with interior designers and architects to create bespoke textiles tailored to specific project requirements.",
  },
  {
    question: "How should I care for my Orelli Bombay textiles?",
    answer: "We recommend professional dry cleaning for most of our upholstery and drapery fabrics to maintain their structural integrity and color. Spot cleaning can be done with a mild, water-free solvent.",
  },
  {
    question: "Can I order fabric samples?",
    answer: "Absolutely. We encourage ordering samples to experience the texture and color firsthand. Please contact us via our enquiry form to request swatches.",
  },
  {
    question: "What is your typical lead time for orders?",
    answer: "Lead times vary depending on the product and order size. In-stock fabrics typically ship within 3-5 business days, while custom handwoven orders may take 6-12 weeks.",
  },
];

export default function FaqAccordion() {
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
              <p className="font-sans text-[16px] text-[#555] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
