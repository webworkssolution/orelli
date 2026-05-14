"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

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
    { name: "Contact", href: "/contact" },
  ];

  const isHome = pathname === "/";
  const useDarkText = scrolled || !isHome;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-400 ease-in-out h-[72px] flex items-center justify-between px-6 md:px-12 ${
          useDarkText ? "bg-background shadow-[0_1px_0_#E8E4DF]" : "bg-transparent"
        }`}
      >
        <Link href="/">
          <span className={`font-cormorant text-[18px] tracking-[0.15em] transition-colors duration-400 ${
            useDarkText ? "text-foreground" : "text-whiteAlt"
          }`}>
            ORELLI BOMBAY
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`nav-link ${pathname.startsWith(link.href) ? "active" : ""} ${
                useDarkText ? "text-foreground" : "text-whiteAlt"
              } transition-colors duration-400`}
            >
              {link.name}
            </Link>
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
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-footerBg z-[55] flex flex-col items-center justify-center transition-opacity duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-cormorant text-whiteAlt text-4xl"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
