"use client";

import { useState } from "react";
import FadeUp from "@/components/ui/FadeUp";

export default function ContactForm() {
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");

    setTimeout(() => {
      setFormStatus("success");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input
        type="text"
        required
        placeholder="Full Name"
        className="w-full bg-transparent border-b border-foreground py-3 text-[14px] font-sans text-foreground placeholder:text-[#888] focus:outline-none focus:border-accent transition-colors"
      />
      <input
        type="email"
        required
        placeholder="Email Address"
        className="w-full bg-transparent border-b border-foreground py-3 text-[14px] font-sans text-foreground placeholder:text-[#888] focus:outline-none focus:border-accent transition-colors"
      />
      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full bg-transparent border-b border-foreground py-3 text-[14px] font-sans text-foreground placeholder:text-[#888] focus:outline-none focus:border-accent transition-colors"
      />
      
      <select 
        required
        className="w-full bg-transparent border-b border-foreground py-3 text-[14px] font-sans text-foreground focus:outline-none focus:border-accent transition-colors appearance-none"
        defaultValue=""
      >
        <option value="" disabled className="text-[#888]">Type of Project</option>
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
        <option value="hospitality">Hospitality</option>
        <option value="other">Other</option>
      </select>

      <textarea
        required
        rows={4}
        placeholder="Tell us about your project"
        className="w-full bg-transparent border-b border-foreground py-3 text-[14px] font-sans text-foreground placeholder:text-[#888] focus:outline-none focus:border-accent transition-colors resize-none"
      />

      <button 
        type="submit" 
        disabled={formStatus === "loading" || formStatus === "success"}
        className={`mt-4 px-[36px] py-[14px] text-[12px] font-sans uppercase tracking-widest transition-all ${
          formStatus === "success" 
            ? "bg-accent text-whiteAlt"
            : "bg-foreground text-background hover:opacity-85"
        }`}
      >
        {formStatus === "idle" && "SEND ENQUIRY"}
        {formStatus === "loading" && "SENDING..."}
        {formStatus === "success" && "MESSAGE SENT ✓"}
        {formStatus === "error" && "ERROR - TRY AGAIN"}
      </button>
    </form>
  );
}
