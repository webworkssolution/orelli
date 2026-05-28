"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModal } from "@/components/context/ModalContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openModal } = useModal();

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Blogs", href: "/blogs" },
    { name: "Enquiry", href: "/contact" },
  ];

  const isHome = pathname === "/";
  const useDarkText = scrolled || !isHome;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-400 ease-in-out h-[72px] flex items-center justify-between px-6 md:px-12 ${
          isAdmin
            ? "bg-[#0f0f0f] border-b border-[#2a2a2a]"
            : useDarkText ? "bg-background shadow-[0_1px_0_#E8E4DF]" : "bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/orelli-without-bg.png"
            alt="Orelli Logo"
            className="w-10 h-10 object-contain"
          />
          <span className={`font-baskerville text-[20px] tracking-[0.10em] transition-colors duration-400 ${
            isAdmin ? "text-[#f5f5f5]" : useDarkText ? "text-foreground" : "text-black"
          }`}>
            ORELLI BOMBAY
          </span>
        </Link>

        {isAdmin ? (
          /* Admin pages: "Visit Website" button */
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-[#C9A96E] text-[#0f0f0f] hover:bg-[#d4b87a]"
          >
            Visit Website
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        ) : (
          <>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                link.name === "Enquiry" ? (
                  <button
                    key={link.name}
                    onClick={openModal}
                    className={`nav-link ${
                      useDarkText ? "text-foreground" : "text-whiteAlt"
                    } transition-colors duration-400 bg-transparent outline-none pb-1`}
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`nav-link ${pathname.startsWith(link.href) ? "active" : ""} ${
                      useDarkText ? "text-foreground" : "text-whiteAlt"
                    } transition-colors duration-400`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col gap-[6px] w-8 items-end z-[60]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              <span
                className={`block h-[1px] transition-all duration-300 w-full ${
                  menuOpen ? "rotate-45 translate-y-[7px] bg-whiteAlt" : `${useDarkText ? "bg-foreground" : "bg-whiteAlt"}`
                }`}
              />
              <span
                className={`block h-[1px] transition-all duration-300 w-full ${
                  menuOpen ? "opacity-0" : `${useDarkText ? "bg-foreground" : "bg-whiteAlt"}`
                }`}
              />
              <span
                className={`block h-[1px] transition-all duration-300 w-full ${
                  menuOpen ? "-rotate-45 -translate-y-[7px] bg-whiteAlt" : `${useDarkText ? "bg-foreground" : "bg-whiteAlt"}`
                }`}
              />
            </button>
          </>
        )}
      </nav>

      {/* Mobile Menu Overlay — only for non-admin pages */}
      {!isAdmin && (
        <div
          className={`fixed inset-0 bg-footerBg z-[55] flex flex-col items-center justify-center transition-opacity duration-500 ${
            menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center gap-8">
            {links.map((link) => (
              link.name === "Enquiry" ? (
                <button
                  key={link.name}
                  onClick={() => {
                    setMenuOpen(false);
                    openModal();
                  }}
                  className="font-cormorant text-whiteAlt text-4xl"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-cormorant text-whiteAlt text-4xl"
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </>
  );
}
