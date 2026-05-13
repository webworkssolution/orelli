import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-footerBg py-20 px-12 text-whiteAlt">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Top section */}
        <div className="flex flex-col items-center mb-12">
          {/* Mandala logo mark */}
          <div className="w-[72px] h-[72px] mb-4 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Orelli Bombay Logo" 
              className="w-full h-full object-contain"
              style={{ filter: 'invert(1) brightness(10)' }}
            />
          </div>
          <h2 className="font-cormorant text-[20px] tracking-[0.2em] text-whiteAlt mt-4 uppercase">
            Orelli Bombay
          </h2>
        </div>

        {/* Middle section - Nav */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-12 text-[12px] uppercase tracking-[0.12em] text-whiteAlt/60">
          <Link href="/categories" className="hover:text-whiteAlt transition-colors">Categories</Link>
          <span>&middot;</span>
          <Link href="/about" className="hover:text-whiteAlt transition-colors">About</Link>
          <span>&middot;</span>
          <Link href="/blogs" className="hover:text-whiteAlt transition-colors">Blogs</Link>
          <span>&middot;</span>
          <Link href="/contact" className="hover:text-whiteAlt transition-colors">Contact</Link>
          <span>&middot;</span>
          <Link href="/privacy" className="hover:text-whiteAlt transition-colors">Privacy Policy</Link>
        </div>

        {/* Social Icons (using simple text/span as placeholders for outline SVGs) */}
        <div className="flex gap-6 mb-12 text-whiteAlt/50">
          <a href="#" className="hover:text-whiteAlt transition-colors" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="#" className="hover:text-whiteAlt transition-colors" aria-label="Pinterest">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.25 2.66 7.89 6.44 9.25-.09-.79-.17-2.01.03-2.88.19-.83 1.25-5.32 1.25-5.32s-.32-.64-.32-1.58c0-1.48.86-2.59 1.93-2.59.91 0 1.35.68 1.35 1.5 0 .91-.58 2.28-.88 3.55-.25 1.06.53 1.92 1.58 1.92 1.89 0 3.34-1.99 3.34-4.87 0-2.56-1.84-4.35-4.48-4.35-3.05 0-5.14 2.29-5.14 4.93 0 .91.35 1.89.79 2.42.09.11.1.2.07.31-.09.38-.3 1.22-.34 1.39-.05.18-.17.22-.35.13-1.3-.61-2.11-2.53-2.11-4.07 0-3.32 2.41-6.38 6.96-6.38 3.65 0 6.48 2.6 6.48 6.07 0 3.63-2.29 6.55-5.46 6.55-1.07 0-2.07-.56-2.42-1.21l-.66 2.52c-.24.93-.89 2.09-1.33 2.8C10.51 21.84 11.24 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"></path>
            </svg>
          </a>
          <a href="#" className="hover:text-whiteAlt transition-colors" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>

        {/* Bottom Strip */}
        <div className="w-full border-t border-white/10 pt-5 mt-5 text-center">
          <p className="font-sans text-[11px] text-whiteAlt/35">
            &copy; {new Date().getFullYear()} Orelli Bombay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
