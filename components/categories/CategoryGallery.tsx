'use client';

import { useState } from 'react';
import FadeUp from '@/components/ui/FadeUp';

interface CategoryGalleryProps {
  title: string;
  gallery: string[];
}

export default function CategoryGallery({ title, gallery }: CategoryGalleryProps) {
  const [activeImage, setActiveImage] = useState(gallery[0]);

  return (
    <div className="w-full md:w-1/2 px-6 md:px-12 flex flex-col gap-4">
      <FadeUp>
        <div className="w-full aspect-square md:aspect-[4/3] xl:aspect-[16/9] max-h-[550px] bg-border rounded-[4px] overflow-hidden relative">
          <img
            src={activeImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          />
        </div>
      </FadeUp>

      {/* Thumbnail Gallery */}
      {gallery.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`w-20 h-20 flex-shrink-0 rounded-[4px] overflow-hidden border transition-all ${
                activeImage === img 
                  ? 'border-foreground opacity-100' 
                  : 'border-border opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
