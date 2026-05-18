"use client";

import { useState, useEffect } from "react";

const IMAGES = [
  "/new-hero-1.jpeg",
  "/new-hero-2.jpeg",
  "/new-upholstery-2.jpeg",
  "/new-drapery-1.jpeg",
  "/new-rugs-1.jpeg",
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-foreground">
      {IMAGES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 w-full h-full transition-opacity duration-[1200ms] ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Ken Burns effect applied to the image element */}
          <div
            className={`w-full h-full bg-cover bg-center ${
              index === currentIndex ? "animate-kenBurns" : ""
            }`}
            style={{ backgroundImage: `url(${src})` }}
          />
        </div>
      ))}

      {/* Overlay gradient */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-white/20 to-white/70 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 z-30 flex items-end justify-between px-12 pb-16">
        <h1 className="font-cormorant italic text-black text-[clamp(28px,4vw,52px)] max-w-[600px] leading-tight">
          Crafted for the spaces you live in.
        </h1>

        <div className="hidden md:flex flex-col items-center gap-4 animate-pulseLine opacity-60">
          <div className="w-[2px] h-[60px] bg-black" />
        </div>
      </div>
    </section>
  );
}
