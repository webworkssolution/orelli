"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",

    hasArchitect: "",
    architectName: "",
    helperText: "",
    photos: null as File | null,
    colourPalette: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send form data to backend/email service
    console.log("Form submitted:", formData);
    alert("Thank you for your enquiry! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      contact: "",

      hasArchitect: "",
      architectName: "",
      helperText: "",
      photos: null,
      colourPalette: null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="bg-background rounded-[8px] w-full h-[90vh] sm:h-auto sm:max-h-[90vh] sm:max-w-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-background border-b border-border px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex items-center justify-between flex-shrink-0">
            <h2 className="font-cormorant text-2xl sm:text-[32px] text-foreground">
              Enquiry
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-border rounded-[4px] transition-colors flex-shrink-0"
            >
              <X size={20} className="text-foreground" />
            </button>
          </div>

          {/* Form - Scrollable */}
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-4 sm:px-6 md:px-8 py-6 space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-sans text-xs sm:text-[14px] uppercase tracking-[0.12em] text-[#888]">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-sans text-[10px] sm:text-[12px] uppercase tracking-[0.1em] text-[#555] mb-2">
                    Name <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    className="w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-accent bg-background"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[10px] sm:text-[12px] uppercase tracking-[0.1em] text-[#555] mb-2">
                    Email <span className="text-accent">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-accent bg-background"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-sans text-[10px] sm:text-[12px] uppercase tracking-[0.1em] text-[#555] mb-2">
                    Phone <span className="text-accent">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    required
                    className="w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-accent bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-border" />



            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="font-sans text-xs sm:text-[14px] uppercase tracking-[0.12em] text-[#888]">
                Additional Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-sans text-[10px] sm:text-[12px] uppercase tracking-[0.1em] text-[#555] mb-2">
                    Do you have your own architect?
                  </label>
                  <select
                    name="hasArchitect"
                    value={formData.hasArchitect}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-accent bg-background"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {formData.hasArchitect === "yes" && (
                  <div>
                    <label className="block font-sans text-[10px] sm:text-[12px] uppercase tracking-[0.1em] text-[#555] mb-2">
                      Architect&apos;s Name <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      name="architectName"
                      value={formData.architectName}
                      onChange={handleInputChange}
                      placeholder="Enter architect's name"
                      required
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-accent bg-background"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-sans text-[10px] sm:text-[12px] uppercase tracking-[0.1em] text-[#555] mb-2">
                    Project Photos
                  </label>
                  <div className="border-2 border-dashed border-border rounded-[4px] p-4 sm:p-6 text-center hover:border-accent transition-colors cursor-pointer h-[120px] flex flex-col items-center justify-center">
                    <input
                      type="file"
                      name="photos"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="photos-input"
                    />
                    <label htmlFor="photos-input" className="cursor-pointer block w-full h-full flex flex-col items-center justify-center">
                      <p className="font-sans text-xs sm:text-[14px] text-[#555]">
                        {formData.photos?.name || "Click to upload"}
                      </p>
                      <p className="font-sans text-[10px] sm:text-[12px] text-[#888] mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-[10px] sm:text-[12px] uppercase tracking-[0.1em] text-[#555] mb-2">
                    Colour Reference
                  </label>
                  <div className="border-2 border-dashed border-border rounded-[4px] p-4 sm:p-6 text-center hover:border-accent transition-colors cursor-pointer h-[120px] flex flex-col items-center justify-center">
                    <input
                      type="file"
                      name="colourPalette"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="colour-input"
                    />
                    <label htmlFor="colour-input" className="cursor-pointer block w-full h-full flex flex-col items-center justify-center">
                      <p className="font-sans text-xs sm:text-[14px] text-[#555]">
                        {formData.colourPalette?.name || "Click to upload"}
                      </p>
                      <p className="font-sans text-[10px] sm:text-[12px] text-[#888] mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-sans text-[10px] sm:text-[12px] uppercase tracking-[0.1em] text-[#555] mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="helperText"
                  value={formData.helperText}
                  onChange={handleInputChange}
                  placeholder="Tell us about your project, vision, budget, timeline..."
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[14px] focus:outline-none focus:ring-1 focus:ring-accent bg-background resize-none"
                />
              </div>
            </div>

            {/* Submit Buttons - Sticky Bottom */}
            <div className="flex gap-3 pb-4 sm:pb-0">
              <button
                type="submit"
                className="flex-1 bg-foreground text-background py-3 rounded-[4px] font-sans font-medium text-sm sm:text-[14px] uppercase tracking-[0.1em] hover:bg-foreground/90 transition-colors"
              >
                Send Enquiry
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-border text-foreground py-3 rounded-[4px] font-sans font-medium text-sm sm:text-[14px] uppercase tracking-[0.1em] hover:bg-border transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
