"use client";

import { useState, useEffect, useRef } from "react";
import FadeUp from "@/components/ui/FadeUp";
import CollectionCard from "@/components/categories/CollectionCard";

const COLLECTIONS = [
  {
    title: "Handwoven Upholstery",
    description: "Rich textures for structured comfort.",
    imageSrc: "https://picsum.photos/seed/coll1/600/800",
    slug: "handwoven-upholstery",
  },
  {
    title: "Sheer Drapery",
    description: "Light-filtering elegance for modern spaces.",
    imageSrc: "https://picsum.photos/seed/coll2/600/800",
    slug: "sheer-drapery",
  },
  {
    title: "Artisan Rugs",
    description: "Grounding your rooms in heritage craft.",
    imageSrc: "https://picsum.photos/seed/coll3/600/800",
    slug: "artisan-rugs",
  },
  {
    title: "Luxury Cushions",
    description: "The perfect finishing touch.",
    imageSrc: "https://picsum.photos/seed/coll4/600/800",
    slug: "luxury-cushions",
  },
];

export default function CollectionsStrip() {
  // Duplicate the collection set on both ends to allow seamless bi-directional looping
  const slides = [...COLLECTIONS, ...COLLECTIONS, ...COLLECTIONS];
  const slidesCount = COLLECTIONS.length;
  const startIndex = slidesCount; // start in the middle copy
  const [index, setIndex] = useState(startIndex); // current index into `slides`
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => i + 1);
    }, 3000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  // When we hit the duplicate middle boundary, jump back to the original
  useEffect(() => {
    // If we've moved past the right boundary (beyond the middle copy), jump to the middle start
    if (index >= startIndex + slidesCount) {
      const t = window.setTimeout(() => {
        setTransitionEnabled(false);
        setIndex(startIndex);
        setTimeout(() => setTransitionEnabled(true), 50);
      }, 500);
      return () => clearTimeout(t);
    }

    // If we've moved past the left boundary (before the middle copy), jump to the middle end
    if (index < startIndex) {
      const t = window.setTimeout(() => {
        setTransitionEnabled(false);
        setIndex(startIndex + slidesCount - 1);
        setTimeout(() => setTransitionEnabled(true), 50);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [index, slidesCount, startIndex]);

  const goToPrevious = () => {
    setTransitionEnabled(true);
    setIndex((i) => i - 1);
  };

  const goToNext = () => {
    setTransitionEnabled(true);
    setIndex((i) => i + 1);
  };

  return (
    <section className="bg-background py-24 px-6 md:px-12">
      <FadeUp>
        <h2 className="font-cormorant text-[clamp(36px,5vw,64px)] text-foreground mb-12">
          Our Categories
        </h2>
      </FadeUp>

      <div className="relative flex items-center gap-8">
        {/* Left Arrow */}
        <button
          onClick={goToPrevious}
          className="absolute -left-12 top-1/3 z-10 p-2 hover:opacity-60 transition-opacity hidden md:block"
          aria-label="Previous collection"
        >
          <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Collections Grid/Carousel */}
        <div className="w-full overflow-hidden">
          <div
            className={`flex gap-8 ${transitionEnabled ? "transition-transform duration-500 ease-in-out" : ""}`}
            style={{ transform: `translateX(-${index * 50}%)` }}
          >
            {slides.map((collection, idx) => (
              <div key={idx} className="flex-shrink-0 w-1/2">
                <CollectionCard {...collection} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="absolute -right-12 top-1/3 z-10 p-2 hover:opacity-60 transition-opacity hidden md:block"
          aria-label="Next collection"
        >
          <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-12">
        {COLLECTIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setTransitionEnabled(true);
              setIndex(i);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === (index % slidesCount) ? "bg-foreground" : "bg-border"
            }`}
            aria-label={`Go to collection ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
