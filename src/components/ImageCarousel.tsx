"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageCarouselProps = {
  images: {
    url: string;
    title: string;
  }[];
  alt: string;
};

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  if (images.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center bg-gray-200">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const nextImage = () => {
    setDirection("next");

    setCurrent((previous) =>
      previous === images.length - 1 ? 0 : previous + 1,
    );
  };

  const previousImage = () => {
    setDirection("prev");

    setCurrent((previous) =>
      previous === 0 ? images.length - 1 : previous - 1,
    );
  };

  return (
    <div className="relative h-[570px] overflow-hidden">
      <img
        key={current}
        src={images[current].url}
        alt={alt}
        className={`h-full w-full object-cover ${
          direction === "next"
            ? "animate-slide-from-right"
            : "animate-slide-from-left"
        }`}
      />

      {/* Previous */}
      <button
        type="button"
        onClick={previousImage}
        aria-label="Previous image"
        className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 hover:cursor-pointer"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>
      {/* Next */}
      <button
        type="button"
        onClick={nextImage}
        aria-label="Next image"
        className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-2xl text-white backdrop-blur-sm transition hover:bg-black/60 hover:cursor-pointer"
      >
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Go to image ${index + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              index === current ? "w-7 bg-white" : "w-2.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
