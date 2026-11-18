"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Photo = { id: string; url: string };

export function ListingGallery({
  photos,
  title,
}: {
  photos: Photo[];
  title: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null || photos.length === 0) return current;
        return (current + direction + photos.length) % photos.length;
      });
    },
    [photos.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  if (photos.length === 0) {
    return (
      <div
        className="flex aspect-[16/10] w-full items-center justify-center rounded-card bg-gradient-to-br from-forest-700/10 to-gold-500/10 text-sm font-semibold text-muted-500"
        role="img"
        aria-label={`${title} — no photos yet`}
      >
        No photo yet
      </div>
    );
  }

  const cover = photos[0];

  return (
    <div>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => setOpenIndex(0)}
        className="relative block aspect-[16/10] w-full overflow-hidden rounded-card bg-ivory-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
        aria-label={`Open photo gallery (${photos.length} ${photos.length === 1 ? "photo" : "photos"})`}
      >
        <Image
          src={cover.url}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </button>

      {photos.length > 1 ? (
        <ul className="mt-2 grid grid-cols-4 gap-2" aria-label="More photos">
          {photos.slice(1, 5).map((photo, index) => (
            <li key={photo.id}>
              <button
                type="button"
                onClick={() => setOpenIndex(index + 1)}
                className="relative block aspect-square w-full overflow-hidden rounded-control bg-ivory-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
                aria-label={`Open photo ${index + 2} of ${photos.length}`}
              >
                <Image
                  src={photo.url}
                  alt=""
                  fill
                  sizes="15vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          className="fixed inset-0 z-50 flex flex-col bg-ink-900/95 p-4 text-white sm:p-8"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-white/80">
              Photo {openIndex + 1} of {photos.length}
            </p>
            <button
              type="button"
              ref={closeRef}
              onClick={close}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="relative mt-4 flex-1">
            <Image
              src={photos[openIndex].url}
              alt={`${title} — photo ${openIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {photos.length > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => step(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
