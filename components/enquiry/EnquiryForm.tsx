"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle, AlertCircle, Clock, Upload, Trash2 } from "lucide-react";

type FormStatus = "idle" | "loading" | "success" | "error" | "rate_limited";

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/* ───────────────────────────────────────────────
   Q1 — "Which suits you best?"

   follow: what appears after this option is picked
     "none"      → nothing
     "architect" → "Do you have an architect / designer?"
     "text"      → a free-text box
   ─────────────────────────────────────────────── */
const CLIENT_TYPES: {
  value: string;
  label: string;
  follow: "none" | "architect" | "text";
}[] = [
  { value: "architect-designer", label: "Architect / Interior Designer", follow: "none" },
  { value: "hotelier", label: "Hotelier", follow: "architect" },
  { value: "homeowner", label: "Homeowner", follow: "architect" },
  { value: "other", label: "Other", follow: "text" },
];

/* Q2 — "Which products are you interested in?" */
const PRODUCTS = [
  "Curtains",
  "Upholstery",
  "Blinds",
  "Wallcovering",
  "Rugs",
  "Outdoor",
];

// Set to false if you'd rather not force a product selection
const PRODUCTS_REQUIRED = true;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const inputClass =
  "w-full px-3 sm:px-4 py-2 border border-border rounded-[4px] font-sans text-sm sm:text-[16px] focus:outline-none focus:ring-1 focus:ring-accent bg-background disabled:opacity-50";
const labelClass =
  "block font-sans text-[12px] sm:text-[14px] uppercase tracking-[0.1em] text-[#555] mb-2";
const sectionHeadingClass =
  "font-sans text-xs sm:text-[16px] uppercase tracking-[0.12em] text-[#888]";

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    clientType: "",
    clientTypeOther: "",
    hasArchitect: "",
    architectName: "",
    products: [] as string[],
    helperText: "",
    photos: [] as File[],
    colourPalette: [] as File[],
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [fileSizeError, setFileSizeError] = useState<Record<string, string>>({});
  const [productError, setProductError] = useState("");

  const getTotalSize = (files: File[]) => files.reduce((sum, f) => sum + f.size, 0);

  const selectedType = CLIENT_TYPES.find((t) => t.value === formData.clientType);
  const follow = selectedType?.follow ?? "none";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      // Changing Q1 must clear whatever the previous branch collected,
      // otherwise a stale answer gets emailed with the wrong question.
      if (name === "clientType") {
        next.clientTypeOther = "";
        next.hasArchitect = "";
        next.architectName = "";
      }

      // Switching to "No" clears a previously typed architect name
      if (name === "hasArchitect" && value !== "yes") {
        next.architectName = "";
      }

      return next;
    });
  };

  const toggleProduct = (product: string) => {
    setProductError("");
    setFormData((prev) => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const fieldName = name as "photos" | "colourPalette";
      const allFiles = [...formData[fieldName], ...Array.from(files)];
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

      setFormData((prev) => ({ ...prev, [fieldName]: allFiles }));
    }
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
      clientType: "",
      clientTypeOther: "",
      hasArchitect: "",
      architectName: "",
      products: [],
      helperText: "",
      photos: [],
      colourPalette: [],
    });
    setStatus("idle");
    setStatusMessage("");
    setFileSizeError({});
    setProductError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Checkboxes can't use the browser's `required`, so validate by hand
    if (PRODUCTS_REQUIRED && formData.products.length === 0) {
      setProductError("Please select at least one product.");
      return;
    }

    setStatus("loading");
    setStatusMessage("");

    try {
      const body = new FormData();
      body.append("name", formData.name);
      body.append("email", formData.email);
      body.append("contact", formData.contact);
      // Send the readable label so the email doesn't show a slug
      body.append("clientType", selectedType?.label || "");
      body.append("clientTypeOther", follow === "text" ? formData.clientTypeOther : "");
      body.append("hasArchitect", follow === "architect" ? formData.hasArchitect : "");
      body.append("architectName", follow === "architect" ? formData.architectName : "");
      body.append("products", formData.products.join(", "));
      body.append("helperText", formData.helperText);
      formData.photos.forEach((file) => body.append("photos", file));
      formData.colourPalette.forEach((file) => body.append("colourPalette", file));

      const res = await fetch("/api/contact", { method: "POST", body });
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
      setStatusMessage(
        "Thank you! Your enquiry has been sent. We'll get back to you soon."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
      setStatusMessage("Could not connect. Please check your internet and try again.");
    }
  };

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
        <label className={labelClass}>{label}</label>
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
                  <span className="truncate text-foreground max-w-[70%]">{file.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[#888]">{formatFileSize(file.size)}</span>
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

          {error && <p className="text-[12px] text-red-500 font-sans mt-2">{error}</p>}
        </div>
      </div>
    );
  };

  /* ── Success state ── */
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle size={48} className="text-green-600 mb-4" />
        <h2 className="font-cormorant text-[32px] text-foreground mb-2">Enquiry Sent</h2>
        <p className="font-sans text-sm text-[#888] max-w-sm mb-8">{statusMessage}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="px-8 py-3 bg-foreground text-background rounded-[4px] font-sans font-medium text-sm uppercase tracking-[0.1em] hover:bg-foreground/90 transition-colors"
          >
            Back to Home
          </Link>
          <button
            onClick={resetForm}
            className="px-8 py-3 border border-border text-foreground rounded-[4px] font-sans font-medium text-sm uppercase tracking-[0.1em] hover:bg-border transition-colors"
          >
            Send Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Status messages */}
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

      {/* ── Contact Information ── */}
      <div className="space-y-4">
        <h2 className={sectionHeadingClass}>Contact Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Name <span className="text-accent">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              autoComplete="name"
              required
              disabled={status === "loading"}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-accent">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              autoComplete="email"
              required
              disabled={status === "loading"}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="contact" className={labelClass}>
              Phone <span className="text-accent">*</span>
            </label>
            <input
              id="contact"
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="+91 XXXXX XXXXX"
              autoComplete="tel"
              required
              disabled={status === "loading"}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-border" />

      {/* ── About You ── */}
      <div className="space-y-4">
        <h2 className={sectionHeadingClass}>About You</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="clientType" className={labelClass}>
              Which suits you best? <span className="text-accent">*</span>
            </label>
            <select
              id="clientType"
              name="clientType"
              value={formData.clientType}
              onChange={handleInputChange}
              required
              disabled={status === "loading"}
              className={inputClass}
            >
              <option value="">Select option</option>
              {CLIENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* "Other" → free text */}
          {follow === "text" && (
            <div>
              <label htmlFor="clientTypeOther" className={labelClass}>
                Please specify <span className="text-accent">*</span>
              </label>
              <input
                id="clientTypeOther"
                type="text"
                name="clientTypeOther"
                value={formData.clientTypeOther}
                onChange={handleInputChange}
                placeholder="Tell us how you'd describe yourself"
                required
                disabled={status === "loading"}
                className={inputClass}
              />
            </div>
          )}

          {/* Hotelier / Homeowner → architect question */}
          {follow === "architect" && (
            <div>
              <label htmlFor="hasArchitect" className={labelClass}>
                Do you have an architect / designer?{" "}
                <span className="text-accent">*</span>
              </label>
              <select
                id="hasArchitect"
                name="hasArchitect"
                value={formData.hasArchitect}
                onChange={handleInputChange}
                required
                disabled={status === "loading"}
                className={inputClass}
              >
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          )}

          {/* ...and if yes, their name */}
          {follow === "architect" && formData.hasArchitect === "yes" && (
            <div className="sm:col-span-2">
              <label htmlFor="architectName" className={labelClass}>
                Architect&apos;s Name <span className="text-accent">*</span>
              </label>
              <input
                id="architectName"
                type="text"
                name="architectName"
                value={formData.architectName}
                onChange={handleInputChange}
                placeholder="Enter architect's name"
                required
                disabled={status === "loading"}
                className={inputClass}
              />
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-[1px] bg-border" />

      {/* ── Products ── */}
      <fieldset className="space-y-4">
        <legend className={sectionHeadingClass}>
          Which products are you interested in?{" "}
          {PRODUCTS_REQUIRED && <span className="text-accent">*</span>}
        </legend>
        <p className="font-sans text-[13px] text-[#888] -mt-2">
          Select all that apply.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {PRODUCTS.map((product) => {
            const checked = formData.products.includes(product);
            return (
              <label
                key={product}
                className={`flex items-center gap-3 px-3 sm:px-4 py-3 border rounded-[4px] cursor-pointer transition-colors font-sans text-sm sm:text-[15px] ${
                  checked
                    ? "border-accent bg-accent/5 text-foreground"
                    : "border-border text-[#555] hover:border-accent/60"
                } ${status === "loading" ? "opacity-50 pointer-events-none" : ""}`}
              >
                <input
                  type="checkbox"
                  name="products"
                  value={product}
                  checked={checked}
                  onChange={() => toggleProduct(product)}
                  disabled={status === "loading"}
                  className="w-4 h-4 accent-accent shrink-0"
                />
                {product}
              </label>
            );
          })}
        </div>

        {productError && (
          <p className="text-[12px] text-red-500 font-sans">{productError}</p>
        )}
      </fieldset>

      <div className="w-full h-[1px] bg-border" />

      {/* ── Project Details ── */}
      <div className="space-y-4">
        <h2 className={sectionHeadingClass}>Project Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {renderFileUpload("photos", "Project Photos", "photos-input")}
          {renderFileUpload("colourPalette", "Colour Reference", "colour-input")}
        </div>

        <div>
          <label htmlFor="helperText" className={labelClass}>
            Additional Notes
          </label>
          <textarea
            id="helperText"
            name="helperText"
            value={formData.helperText}
            onChange={handleInputChange}
            placeholder="Tell us about your project, vision, budget, timeline..."
            rows={5}
            disabled={status === "loading"}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* ── Submit ── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
        <Link
          href="/"
          className="flex-1 flex items-center justify-center border border-border text-foreground py-3 rounded-[4px] font-sans font-medium text-sm sm:text-[16px] uppercase tracking-[0.1em] hover:bg-border transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
