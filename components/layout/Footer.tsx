"use client";

import Link from "next/link";

export default function Footer() {

  return (
    <footer className="bg-footerBg py-8 px-12 text-foreground">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Top section */}
        <div className="flex flex-col items-center mb-8">
          {/* Mandala logo mark */}
          <div className="w-[200px] h-[200px] mb-2 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Orelli Bombay Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Middle section - Nav */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6 text-[14px] uppercase tracking-[0.12em] text-foreground/60">
          <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
          <span>·</span>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <span>·</span>
          <Link href="/blogs" className="hover:text-foreground transition-colors">Blogs</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          <span>·</span>
          <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
          <span>·</span>
          <Link href="/enquiry" className="hover:text-foreground transition-colors uppercase tracking-[0.12em] text-[14px]">Enquiry</Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        </div>

        {/* Social Icons (using simple text/span as placeholders for outline SVGs) */}
        <div className="flex gap-6 mb-6 text-foreground/50">
          <a href="https://www.instagram.com/orelli.bombay" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/orelli-bombay/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>

        <div className="w-full border-t border-foreground/10 pt-4 mt-2 text-center">
          <p className="font-sans text-[13px] text-foreground/50">
            © 2026 Orelli Bombay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
