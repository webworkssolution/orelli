"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error" | "rate_limited">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData();

    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const projectType = (form.elements.namedItem("projectType") as HTMLSelectElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    formData.append("name", name);
    formData.append("email", email);
    formData.append("contact", phone);
    formData.append("hasArchitect", "");
    formData.append("architectName", "");
    formData.append("helperText", `[Project Type: ${projectType}]\n\n${message}`);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.status === 429) {
        setFormStatus("rate_limited");
        setErrorMessage(data.message || "Please wait before submitting again.");
        return;
      }

      if (!res.ok) {
        setFormStatus("error");
        setErrorMessage(data.message || "Something went wrong. Please try again.");
        return;
      }

      setFormStatus("success");
    } catch {
      setFormStatus("error");
      setErrorMessage("Could not connect. Please check your internet and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {formStatus === "rate_limited" && (
        <p className="font-sans text-sm text-amber-700">{errorMessage}</p>
      )}
      {formStatus === "error" && (
        <p className="font-sans text-sm text-red-600">{errorMessage}</p>
      )}

      <input
        type="text"
        name="name"
        required
        placeholder="Full Name"
        disabled={formStatus === "loading" || formStatus === "success"}
        className="w-full bg-transparent border-b border-foreground py-3 text-[14px] font-sans text-foreground placeholder:text-[#888] focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
      />
      <input
        type="email"
        name="email"
        required
        placeholder="Email Address"
        disabled={formStatus === "loading" || formStatus === "success"}
        className="w-full bg-transparent border-b border-foreground py-3 text-[14px] font-sans text-foreground placeholder:text-[#888] focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        disabled={formStatus === "loading" || formStatus === "success"}
        className="w-full bg-transparent border-b border-foreground py-3 text-[14px] font-sans text-foreground placeholder:text-[#888] focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
      />
      
      <select 
        name="projectType"
        required
        disabled={formStatus === "loading" || formStatus === "success"}
        className="w-full bg-transparent border-b border-foreground py-3 text-[14px] font-sans text-foreground focus:outline-none focus:border-accent transition-colors appearance-none disabled:opacity-50"
        defaultValue=""
      >
        <option value="" disabled className="text-[#888]">Type of Project</option>
        <option value="Residential">Residential</option>
        <option value="Commercial">Commercial</option>
        <option value="Hospitality">Hospitality</option>
        <option value="Other">Other</option>
      </select>

      <textarea
        name="message"
        required
        rows={4}
        placeholder="Tell us about your project"
        disabled={formStatus === "loading" || formStatus === "success"}
        className="w-full bg-transparent border-b border-foreground py-3 text-[14px] font-sans text-foreground placeholder:text-[#888] focus:outline-none focus:border-accent transition-colors resize-none disabled:opacity-50"
      />

      <button 
        type="submit" 
        disabled={formStatus === "loading" || formStatus === "success"}
        className={`mt-4 px-[36px] py-[14px] text-[12px] font-sans uppercase tracking-widest transition-all ${
          formStatus === "success" 
            ? "bg-[#E8E4DF] text-black"
            : "bg-transparent border border-black text-black hover:bg-[#E8E4DF]"
        } disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {formStatus === "idle" && "SEND ENQUIRY"}
        {formStatus === "loading" && "SENDING..."}
        {formStatus === "success" && "MESSAGE SENT ✓"}
        {formStatus === "error" && "TRY AGAIN"}
        {formStatus === "rate_limited" && "PLEASE WAIT"}
      </button>
    </form>
  );
}
