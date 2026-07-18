"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { usePresence } from "@/lib/use-presence";
import { cn } from "@/lib/utils";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const lightbox = usePresence(open, 300);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, next, prev]);

  return (
    <>
      {/* Editorial mosaic */}
      <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2">
        {images.slice(0, 5).map((src, i) => (
          <button
            key={src + i}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className={cn(
              "img-zoom group relative overflow-hidden focus-visible:z-10",
              i === 0
                ? "aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto md:rounded-l-3xl"
                : "hidden aspect-[4/3] md:block",
              i === 2 && "md:rounded-tr-3xl",
              i === 4 && "md:rounded-br-3xl"
            )}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
          >
            <Image
              src={src}
              alt={`${title} — photo ${i + 1}`}
              fill
              priority={i === 0}
              sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "25vw"}
              className="object-cover"
            />
            <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
          </button>
        ))}
        <button
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          className="absolute bottom-4 right-4 z-10 hidden items-center gap-2 rounded-full bg-raised/95 px-4 py-2.5 text-sm font-medium shadow-card backdrop-blur-sm transition-transform hover:scale-105 md:flex"
        >
          <Expand size={15} />
          All {images.length} photos
        </button>
        {/* Mobile count pill */}
        <button
          onClick={() => setOpen(true)}
          className="absolute bottom-3 right-3 z-10 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-medium text-paper backdrop-blur-sm md:hidden"
        >
          1 / {images.length}
        </button>
      </div>

      {/* Lightbox */}
      {lightbox.mounted && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          className={cn(
            "fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-md transition-opacity duration-300",
            lightbox.shown ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex items-center justify-between p-4 text-paper">
            <p className="text-sm text-paper/70">
              {index + 1} / {images.length}
            </p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close gallery"
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>
          <div className="relative flex-1">
            <div key={index} className="lightbox-frame absolute inset-4 md:inset-12">
              <Image
                src={images[index]}
                alt={`${title} — photo ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-paper backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-paper backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <ChevronRight size={22} />
            </button>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto p-4">
            {images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setIndex(i)}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all",
                  i === index ? "ring-2 ring-brass" : "opacity-50 hover:opacity-90"
                )}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
