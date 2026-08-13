"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

type GalleryImage = {
  url: string;
};

type ImageGalleryProps = {
  images: GalleryImage[];
  title: string;
};

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);

  const hasMultiple = images.length > 1;

  const goPrev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative flex min-h-80 items-center justify-center bg-[#114b3d] text-white overflow-hidden">
      {images.length > 0 ? (
        <>
          <img
            src={images[current].url}
            alt={`${title} — image ${current + 1} of ${images.length}`}
            className="h-full w-full object-cover"
          />

          {/* Left / Right arrows — only when multiple images */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {hasMultiple && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-2 w-2 rounded-full transition ${
                    i === current ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <Home className="h-24 w-24 opacity-90" aria-hidden="true" />
      )}
    </div>
  );
}
