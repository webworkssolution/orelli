"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle, AlertCircle, Clock, Upload, Trash2 } from "lucide-react";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormStatus = "idle" | "loading" | "success" | "error" | "rate_limited";

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    hasArchitect: "",
    architectName: "",
    helperText: "",
    photos: [] as File[],
    colourPalette: [] as File[],
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [fileSizeError, setFileSizeError] = useState<Record<string, string>>({});

  const getTotalSize = (files: File[]) => files.reduce((sum, f) => sum + f.size, 0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const fieldName = name as "photos" | "colourPalette";
      const newFiles = Array.from(files);
      const existingFiles = formData[fieldName];
      const allFiles = [...existingFiles, ...newFiles];
      const totalSize = getTotalSize(allFiles);

      if (totalSize > MAX_FILE_SIZE_BYTES) {
        setFileSizeError((prev) => ({
          ...prev,
          [fieldName]: `Total size exceeds ${MAX_FILE_SIZE_MB}MB. Current: ${formatFileSize(totalSize)}`,
        }));
        return;
      }

      setFileSizeError((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });

      setFormData((prev) => ({
        ...prev,
        [fieldName]: allFiles,
      }));
    }
    // Reset input so the same files can be re-selected
    e.target.value = "";
  };

  const removeFile = (fieldName: "photos" | "colourPalette", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
    setFileSizeError((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      contact: "",
      hasArchitect: "",
      architectName: "",
      helperText: "",
      photos: [],
      colourPalette: [],
    });
    setStatus("idle");
    setStatusMessage("");
    setFileSizeError({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setStatusMessage("");

    try {
      // Build FormData for file uploads
      const body = new FormData();
      body.append("name", formData.name);
      body.append("email", formData.email);
      body.append("contact", formData.contact);
      body.append("hasArchitect", formData.hasArchitect);
      body.append("architectName", formData.architectName);
      body.append("helperText", formData.helperText);
      formData.photos.forEach((file) => body.append("photos", file));
      formData.colourPalette.forEach((file) => body.append("colourPalette", file));

      const res = await fetch("/api/contact", {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (res.status === 429) {
        setStatus("rate_limited");
        setStatusMessage(data.message || "Please wait before submitting again.");
        return;
      }

      if (!res.ok) {
        setStatus("error");
        setStatusMessage(data.message || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setStatusMessage("Thank you! Your enquiry has been sent. We'll get back to you soon.");
    } catch {
      setStatus("error");
      setStatusMessage("Could not connect. Please check your internet and try again.");
    }
  };

  const handleClose = () => {
    if (status === "success") resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const renderFileUpload = (
    fieldName: "photos" | "colourPalette",
    label: string,
    inputId: string
  ) => {
    const files = formData[fieldName];
    const totalSize = getTotalSize(files);
    const error = fileSizeError[fieldName];

    return (
      <div>
        <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
          {label}
        </label>
        <div className="border-2 border-dashed border-border rounded-[4px] p-4 hover:border-accent transition-colors">
          <input
            type="file"
            name={fieldName}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
            id={inputId}
            disabled={status === "loading"}
          />
          <label
            htmlFor={inputId}
            className="cursor-pointer flex flex-col items-center justify-center py-2"
          >
            <Upload size={18} className="text-[#888] mb-1" />
            <p className="font-sans text-xs sm:text-[16px] text-[#555]">
              Click to upload images
            </p>
            <p className="font-sans text-[12px] sm:text-[14px] text-[#888] mt-1">
              PNG, JPG, GIF — up to {MAX_FILE_SIZE_MB}MB total
            </p>
          </label>

          {files.length > 0 && (
            <div className="mt-3 space-y-1.5 border-t border-border pt-3">
              {files.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between gap-2 text-xs font-sans bg-border/30 rounded px-2 py-1.5"
                >
                  <span className="truncate text-foreground max-w-[70%]">
                    {file.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[#888]">
                      {formatFileSize(file.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(fieldName, i)}
                      className="text-red-400 hover:text-red-600 transition-colors p-0.5"
                      aria-label={`Remove ${file.name}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
              <p className="text-[12px] text-[#888] font-sans pt-1">
                {files.length} file(s) · {formatFileSize(totalSize)} total
              </p>
            </div>
          )}

          {error && (
            <p className="text-[12px] text-red-500 font-sans mt-2">{error}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={handleClose}
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
              onClick={handleClose}
              title="Close enquiry modal"
              aria-label="Close enquiry modal"
              className="p-2 hover:bg-border rounded-[4px] transition-colors flex-shrink-0"
            >
              <X size={20} className="text-foreground" />
            </button>
          </div>

          {/* Success State */}
          {status === "success" ? (
            <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
              <CheckCircle size={48} className="text-green-600 mb-4" />
              <h3 className="font-cormorant text-2xl text-foreground mb-2">Enquiry Sent!</h3>
              <p className="font-sans text-sm text-[#888] max-w-sm mb-8">
                {statusMessage}
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-foreground text-background rounded-[4px] font-sans font-medium text-sm uppercase tracking-[0.1em] hover:bg-foreground/90 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            /* Form - Scrollable */
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-4 sm:px-6 md:px-8 py-6 space-y-6">

              {/* Status Messages */}
              {status === "rate_limited" && (
                <div className="flex items-start gap-3 p-4 rounded-md bg-amber-50 border border-amber-200">
                  <Clock size={18} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="font-sans text-sm text-amber-800">{statusMessage}</p>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-start gap-3 p-4 rounded-md bg-red-50 border border-red-200">
                  <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                  <p className="font-sans text-sm text-red-800">{statusMessage}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-sans text-xs sm:text-[16px] uppercase tracking-[0.12em] text-[#888]">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                      Name <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      required
                      disabled={status === "loading"}
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[16px] focus:outline-none focus:ring-1 focus:ring-accent bg-background disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                      Email <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                      disabled={status === "loading"}
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[16px] focus:outline-none focus:ring-1 focus:ring-accent bg-background disabled:opacity-50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                      Phone <span className="text-accent">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      required
                      disabled={status === "loading"}
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[16px] focus:outline-none focus:ring-1 focus:ring-accent bg-background disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-border" />

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="font-sans text-xs sm:text-[16px] uppercase tracking-[0.12em] text-[#888]">
                  Additional Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                      Do you have your own architect / designer?
                    </label>
                    <select
                      name="hasArchitect"
                      title="Do you have an architect"
                      aria-label="Do you have an architect"
                      value={formData.hasArchitect}
                      onChange={handleInputChange}
                      disabled={status === "loading"}
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[16px] focus:outline-none focus:ring-1 focus:ring-accent bg-background disabled:opacity-50"
                    >
                      <option value="">Select option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {formData.hasArchitect === "yes" && (
                    <div>
                      <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                        Architect&apos;s Name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        name="architectName"
                        value={formData.architectName}
                        onChange={handleInputChange}
                        placeholder="Enter architect's name"
                        required
                        disabled={status === "loading"}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[16px] focus:outline-none focus:ring-1 focus:ring-accent bg-background disabled:opacity-50"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {renderFileUpload("photos", "Project Photos", "photos-input")}
                  {renderFileUpload("colourPalette", "Colour Reference", "colour-input")}
                </div>

                <div>
                  <label className="block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="helperText"
                    value={formData.helperText}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project, vision, budget, timeline..."
                    rows={4}
                    disabled={status === "loading"}
                    className="w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[16px] focus:outline-none focus:ring-1 focus:ring-accent bg-background resize-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pb-4 sm:pb-0">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded-[4px] font-sans font-medium text-sm sm:text-[16px] uppercase tracking-[0.1em] hover:bg-foreground/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Enquiry"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={status === "loading"}
                  className="flex-1 border border-border text-foreground py-3 rounded-[4px] font-sans font-medium text-sm sm:text-[16px] uppercase tracking-[0.1em] hover:bg-border transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
