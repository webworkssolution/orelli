"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ArrowUp } from "lucide-react";
import EnquiryModal from "./EnquiryModal";

export default function StickyActionBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll to top button when scrolled down more than 300px
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <EnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Sticky Action Buttons */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 flex flex-col gap-2 sm:gap-3 z-40">
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} className="sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Enquiry Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-accent text-background flex items-center justify-center hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
          aria-label="Open enquiry form"
        >
          <MessageSquare size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </>
  );
}
