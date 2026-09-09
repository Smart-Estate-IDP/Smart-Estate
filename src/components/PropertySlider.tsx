"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import PropertyCard, { PropertyCardProps } from "@/components/PropertyCard";

interface PropertySliderProps {
  properties: PropertyCardProps[];
  autoSlideInterval?: number;
}

export default function PropertySlider({
  properties,
  autoSlideInterval = 3500,
}: PropertySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const totalCount = properties.length;

  // Touch / Drag State for Mobile Swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive items count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Maximum scroll index so the last visible set ends cleanly on the final property
  const maxIndex = Math.max(0, totalCount - visibleCount);

  // Keep index within bounds if window resize changes maxIndex
  useEffect(() => {
    setCurrentIndex((prev) => (prev > maxIndex ? maxIndex : prev));
  }, [maxIndex]);

  // Next slide: loops smoothly back to starting image (0) when last image is reached
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Prev slide: loops to last image when at the beginning (0)
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide interval: continuously advances and loops back to 0
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [isPaused, handleNext, autoSlideInterval]);

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative space-y-5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Controls Bar: Listing Counter & Arrow Buttons (No pause/auto-sliding button) */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500 font-semibold">
          Showing <span className="text-[#3155FF] font-bold">{currentIndex + 1}</span> -{" "}
          <span className="text-[#3155FF] font-bold">
            {Math.min(currentIndex + visibleCount, totalCount)}
          </span>{" "}
          of <span className="font-bold text-slate-700">{totalCount}</span> verified homes
        </p>

        {/* Previous and Next Arrow Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full neu-raised flex items-center justify-center text-slate-700 hover:text-[#3155FF] active:neu-inset transition-all"
            aria-label="Previous Property"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full neu-raised flex items-center justify-center text-slate-700 hover:text-[#3155FF] active:neu-inset transition-all"
            aria-label="Next Property"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider Carousel Window */}
      <div className="overflow-hidden py-3 -my-3 px-1 -mx-1">
        <div
          className="flex transition-transform duration-600 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            transitionDuration: "600ms",
            transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex-shrink-0 px-3 sm:px-4"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <div className="h-full">
                <PropertyCard {...property} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx
                ? "w-8 h-2.5 bg-[#3155FF] shadow-[0_0_10px_rgba(49,85,255,0.5)]"
                : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
