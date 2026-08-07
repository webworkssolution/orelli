"use client";

import { useState, useEffect, useRef } from "react";
import FadeUp from "@/components/ui/FadeUp";
import CollectionCard from "@/components/categories/CollectionCard";

interface CategoryData {
  title: string;
  description: string;
  imageSrc: string;
  slug: string;
}

interface CollectionsStripProps {
  categories: CategoryData[];
}

export default function CollectionsStrip({ categories }: CollectionsStripProps) {
  // Duplicate the collection set on both ends to allow seamless bi-directional looping
  const slides = [...categories, ...categories, ...categories];
  const slidesCount = categories.length;
  const startIndex = slidesCount; // start in the middle copy
  const [index, setIndex] = useState(startIndex); // current index into `slides`
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (slidesCount === 0) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => i + 1);
    }, 3000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [slidesCount]);

  // When we hit the duplicate middle boundary, jump back to the original
  useEffect(() => {
    if (slidesCount === 0) return;

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

  if (categories.length === 0) return null;

  return (
    <section className="bg-background py-12 px-6 md:px-12">
      <FadeUp>
        <h2 className="font-cormorant text-[clamp(36px,5vw,64px)] text-foreground mb-12">
          Our Categories
        </h2>
      </FadeUp>

      <div className="relative flex items-center">
        {/* Left Arrow */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/3 z-10 p-2 bg-background/50 backdrop-blur-md rounded-full hover:bg-background/80 transition-colors hidden md:block border border-border"
          aria-label="Previous collection"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Collections Grid/Carousel */}
        <div className="w-full overflow-hidden [--slide-width:100%] md:[--slide-width:50%] lg:[--slide-width:33.3333%]">
          <div
            className={`flex ${transitionEnabled ? "transition-transform duration-500 ease-in-out" : ""}`}
            style={{ transform: `translateX(calc(-${index} * var(--slide-width)))` }}
          >
            {slides.map((collection, idx) => (
              <div key={idx} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-3 md:px-4">
                <CollectionCard {...collection} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/3 z-10 p-2 bg-background/50 backdrop-blur-md rounded-full hover:bg-background/80 transition-colors hidden md:block border border-border"
          aria-label="Next collection"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-12">
        {categories.map((_, i) => (
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
