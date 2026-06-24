"use client";

import React, { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import FadeUp from "../ui/FadeUp";

interface CareersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEPARTMENTS = [
  "Design",
  "Sales",
  "Marketing",
  "Operations",
  "Production",
  "Other"
];

export default function CareersModal({ isOpen, onClose }: CareersModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    city: "",
    department: "",
    portfolioLink: "",
  });

  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const body = new FormData();
      body.append("name", formData.name);
      body.append("number", formData.number);
      body.append("email", formData.email);
      body.append("city", formData.city);
      body.append("department", formData.department);
      if (formData.portfolioLink) body.append("portfolioLink", formData.portfolioLink);
      
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        body.append("resume", file);
      }

      const res = await fetch("/api/careers", {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong.");
        return;
      }

      setStatus("success");
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setStatus("idle");
        setFormData({
          name: "",
          number: "",
          email: "",
          city: "",
          department: "",
          portfolioLink: "",
        });
        setFileName(null);
        onClose();
      }, 4000);
    } catch {
      setStatus("error");
      setErrorMessage("Could not connect. Please check your internet and try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[600px] bg-background shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-sans text-[20px] sm:text-[22px] text-foreground tracking-wide">
            Careers Application
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-border/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <FadeUp>
              <div className="text-center py-12">
                <h3 className="font-cormorant text-[32px] text-accent mb-4">Application Submitted</h3>
                <p className="font-sans text-[#555]">
                  Thank you for your interest in joining Orelli Bombay.<br/>
                  Our team will review your application and get back to you soon.
                </p>
              </div>
            </FadeUp>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-border pb-3 font-sans text-[16px] text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-[#999]"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="number"
                    required
                    value={formData.number}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-border pb-3 font-sans text-[16px] text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-[#999]"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-border pb-3 font-sans text-[16px] text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-[#999]"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-border pb-3 font-sans text-[16px] text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-[#999]"
                    placeholder="Your current city"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                  Interested Department *
                </label>
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-border pb-3 font-sans text-[16px] text-foreground focus:outline-none focus:border-accent transition-colors cursor-pointer appearance-none"
                >
                  <option value="" disabled>Select department</option>
                  {DEPARTMENTS.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                  Portfolio / LinkedIn Link (Optional)
                </label>
                <input
                  type="url"
                  name="portfolioLink"
                  value={formData.portfolioLink}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-border pb-3 font-sans text-[16px] text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-[#999]"
                  placeholder="https://"
                />
              </div>

              <div>
                <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                  Resume (PDF) *
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-border p-6 rounded-[4px] flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 transition-colors bg-[#E8E4DF]/20"
                >
                  <Upload className="w-5 h-5 text-[#888] mb-2" />
                  <span className="font-sans text-[15px] text-[#555]">
                    {fileName ? fileName : "Click to upload your resume"}
                  </span>
                  {!fileName && (
                    <span className="font-sans text-[13px] text-[#999] mt-1">PDF — up to 5MB</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="pt-4 flex flex-col gap-4">
                {status === "error" && (
                  <div className="text-[#d32f2f] text-[13px] bg-[#d32f2f]/10 p-3 rounded-[4px] border border-[#d32f2f]/20">
                    {errorMessage}
                  </div>
                )}
                <div className="flex gap-4 w-full">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-outline flex-1 bg-black text-white hover:bg-black/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Submitting..." : "Submit Application"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={status === "loading"}
                    className="btn-outline flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
