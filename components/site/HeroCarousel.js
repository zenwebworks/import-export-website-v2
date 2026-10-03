"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SLIDE_DURATION = 6000;
const SWIPE_THRESHOLD = 42;

const SLIDES = [
  {
    id: "home",
    image: "/assets/hero-home.png",
    alt: "Cargo ship, airplane, global market globe, and Indian export products",
    objectPosition: "object-center",
    scrimStrong: 0.64,
    scrimMid: 0.36,
    // Vertical scrim used only on mobile (<md). Tuned per-image so text stays
    // legible regardless of where the brightest part of the photo falls.
    mobileScrim: { top: 0.42, mid: 0.34, bottom: 0.5 },
    headlineTop: "FROM INDIA.",
    headlineBottom: "TO THE WORLD.",
    paragraph:
      "Global sourcing, import, export, and international trade solutions connecting premium Indian products with global markets.",
    mobileParagraph: "Global sourcing, import, export, and international trade from India to global markets.",
    points: ["Trusted Sourcing", "Premium Quality", "Global Supply", "On-Time Delivery"],
    primaryLabel: "Explore Products",
    primaryHref: "/products",
    secondaryLabel: "Request a Quote",
    secondaryHref: "/request-a-quote",
  },
  {
    id: "about",
    image: "/assets/hero-about.png",
    alt: "Business trade planning with laptop world map, port logistics, and global connections",
    objectPosition: "object-[58%_center] lg:object-center",
    scrimStrong: 0.78,
    scrimMid: 0.44,
    mobileScrim: { top: 0.52, mid: 0.48, bottom: 0.6 },
    headlineTop: "BUILDING TRUSTED",
    headlineBottom: "GLOBAL CONNECTIONS",
    paragraph:
      "An India-based international trade partner connecting reliable suppliers with global buyers.",
    mobileParagraph: "Trusted trade connections between reliable Indian suppliers and global buyers.",
    points: ["Global Partnerships", "Quality Products", "Worldwide Markets", "Growth Together"],
    primaryLabel: "About Ramshel",
    primaryHref: "/about",
    secondaryLabel: "Contact Us",
    secondaryHref: "/contact",
  },
  {
    id: "sourcing",
    image: "/assets/hero-global-sourcing.png",
    alt: "Global sourcing scene with cargo ship, airplane, truck, cartons, and connected world map",
    objectPosition: "object-[72%_center] md:object-[35%_center]",
    scrimStrong: 0.58,
    scrimMid: 0.32,
    mobileScrim: { top: 0.38, mid: 0.3, bottom: 0.46 },
    headlineTop: "GLOBAL SOURCING",
    headlineBottom: "FROM INDIA",
    paragraph: "Reliable products, trusted suppliers, competitive pricing, and export-ready supply.",
    mobileParagraph: "Reliable products, trusted suppliers, and export-ready supply from India.",
    points: ["Product Sourcing", "Supplier Identification", "Quality Verification", "Competitive Pricing"],
    primaryLabel: "Find Your Product",
    primaryHref: "/sourcing",
    secondaryLabel: "Request a Quote",
    secondaryHref: "/request-a-quote",
  },
];

const TEXT_SHADOW = { textShadow: "0 2px 10px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.85)" };

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const touchStartRef = useRef({ x: 0, y: 0 });
  const currentSlide = SLIDES[index];
  const isPaused = userPaused || interactionPaused || pageHidden;
  const isAutoPlaying = !isPaused && !reducedMotion;

  const goToSlide = useCallback((next) => {
    const length = SLIDES.length;
    setIndex(((next % length) + length) % length);
    setTimerKey((key) => key + 1);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (event) => setReducedMotion(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [isAutoPlaying, timerKey]);

  // --- Touch swipe support (mobile) -----------------------------------
  const handleTouchStart = useCallback((event) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setInteractionPaused(true);
  }, []);

  const handleTouchEnd = useCallback(
    (event) => {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      setInteractionPaused(false);

      // Only treat as a slide-swipe if the gesture is clearly horizontal,
      // so vertical page scrolling on mobile is never hijacked.
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.3) {
        goToSlide(dx < 0 ? index + 1 : index - 1);
      }
    },
    [goToSlide, index],
  );

  const handleTouchCancel = useCallback(() => setInteractionPaused(false), []);

  // Roving-tabindex style keyboard support scoped to the dot controls, so
  // arrow keys only change slides when a dot actually has focus.
  const handleDotsKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSlide(index + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(index - 1);
      }
    },
    [goToSlide, index],
  );

  return (
    <section
      id="hero"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured trade highlights"
      className="relative isolate touch-pan-y overflow-hidden bg-[#061927] text-white"
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocus={() => setInteractionPaused(true)}
      onBlur={() => setInteractionPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <div className="absolute inset-0 -z-10">
        {SLIDES.map((slide, slideIndex) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${SLIDES.length}`}
            aria-hidden={slideIndex !== index}
            className={cn(
              "absolute inset-0 ease-in-out",
              reducedMotion ? "duration-0" : "transition-opacity duration-[1200ms]",
              slideIndex === index ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={slideIndex === 0}
              quality={82}
              sizes="100vw"
              className={cn("object-cover", slide.objectPosition)}
            />

            {/* Mobile: full-bleed vertical scrim, tuned per image for contrast */}
            <div
              className="absolute inset-0 md:hidden"
              style={{
                background: `linear-gradient(180deg, rgba(3,10,18,${slide.mobileScrim.top}) 0%, rgba(3,10,18,${slide.mobileScrim.mid}) 46%, rgba(3,10,18,${slide.mobileScrim.bottom}) 100%)`,
              }}
            />
            {/* Desktop/tablet: side-weighted scrim so the left text column always reads clearly */}
            <div
              className="absolute inset-0 hidden md:block"
              style={{
                background: `linear-gradient(90deg, rgba(3,10,18,${slide.scrimStrong}) 0%, rgba(3,10,18,${slide.scrimMid}) 42%, rgba(3,10,18,0) 68%)`,
              }}
            />
            {/* Desktop-only bottom vignette. On mobile the tuned scrim above already
                handles bottom contrast, so we don't stack a second dark layer there. */}
            <div className="absolute inset-0 hidden bg-[linear-gradient(0deg,rgba(3,10,18,0.46)_0%,rgba(3,10,18,0)_40%)] md:block" />
          </div>
        ))}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_22%_38%,rgba(245,178,61,0.10),transparent_30%)]" />
      </div>

      <div className="container-x relative flex min-h-[max(560px,calc(100svh-4.5rem))] items-start pb-16 pt-8 sm:min-h-[620px] sm:items-center sm:pb-24 sm:pt-14 md:min-h-[650px] md:py-20 lg:min-h-[690px]">
        <div className="w-full max-w-[520px] lg:max-w-[570px]">
          <div className="grid" aria-live={isAutoPlaying ? "off" : "polite"}>
            {SLIDES.map((slide, slideIndex) => (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-hidden={slideIndex !== index}
                className={cn(
                  "[grid-area:1/1] ease-out",
                  reducedMotion ? "duration-0" : "transition-all duration-700",
                  slideIndex === index ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
                )}
              >
                <h1 className="text-[clamp(2.4rem,10.5vw,2.9rem)] font-extrabold uppercase leading-[0.92] text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-6xl xl:text-7xl">
                  {slide.headlineTop}
                  <span className="mt-1 block text-gold">{slide.headlineBottom}</span>
                </h1>
                <p className="mt-3 max-w-[33rem] text-lg font-semibold leading-relaxed text-white/95 sm:mt-5 sm:hidden" style={TEXT_SHADOW}>
                  {slide.mobileParagraph || slide.paragraph}
                </p>
                <p className="mt-5 hidden max-w-2xl text-lg font-semibold leading-relaxed text-white/95 sm:block md:text-xl" style={TEXT_SHADOW}>
                  {slide.paragraph}
                </p>
              </div>
            ))}
          </div>

          <ul
            key={currentSlide.id}
            className="mt-6 grid max-w-[520px] grid-cols-1 gap-y-3 text-base font-semibold leading-tight text-white/95 sm:mt-7 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4 sm:text-sm"
          >
            {currentSlide.points.map((item) => (
              <li key={item} className="flex min-w-0 items-center gap-2 sm:gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-black/35 backdrop-blur-[2px] sm:h-6 sm:w-6">
                  <CheckCircle2 className="h-5 w-5 text-gold sm:h-5 sm:w-5" />
                </span>
                <span style={TEXT_SHADOW}>{item}</span>
              </li>
            ))}
          </ul>

          <div key={`${currentSlide.id}-actions`} className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <Button asChild variant="gold" size="xl" className="h-14 w-full rounded px-6 text-sm font-bold uppercase text-[#061626] sm:h-14 sm:w-auto sm:px-8 sm:text-sm">
              <Link href={currentSlide.primaryHref}>{currentSlide.primaryLabel}</Link>
            </Button>
            <Button
              asChild
              variant="outlineLight"
              size="xl"
              className="h-14 w-full rounded border-gold/65 bg-[#061626]/35 px-6 text-sm font-bold uppercase text-white hover:bg-gold/15 sm:h-14 sm:w-auto sm:px-8 sm:text-sm"
            >
              <Link href={currentSlide.secondaryHref}>
                {currentSlide.secondaryLabel} <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Prev/Next: shown from sm up. On mobile, swipe replaces these. */}
      <button
        type="button"
        onClick={() => goToSlide(index - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:left-6 sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => goToSlide(index + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:right-6 sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots: stay centered at the bottom on every breakpoint */}
      <div
        className="absolute inset-x-0 z-10 flex items-center justify-center px-4"
        style={{ bottom: "max(1.1rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center gap-1" onKeyDown={handleDotsKeyDown}>
          {SLIDES.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(slideIndex)}
              aria-label={`Go to slide ${slideIndex + 1}: ${slide.headlineTop} ${slide.headlineBottom}`}
              aria-current={slideIndex === index ? "true" : undefined}
              className="group flex h-10 w-10 items-center justify-center focus-visible:outline-none"
            >
              <span className="relative h-1.5 w-8 overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/40 group-focus-visible:ring-2 group-focus-visible:ring-gold/60 sm:w-9">
                {slideIndex === index && (
                  <span
                    key={timerKey}
                    style={isAutoPlaying ? { animationDuration: `${SLIDE_DURATION}ms` } : undefined}
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full bg-gold",
                      isAutoPlaying ? "animate-hero-progress" : "w-full",
                    )}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Play/Pause: pinned to the bottom-right corner on every breakpoint */}
      <button
        type="button"
        onClick={() => setUserPaused((value) => !value)}
        aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
        className="absolute right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:right-6"
        style={{ bottom: "max(1.1rem, env(safe-area-inset-bottom))" }}
      >
        {userPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      </button>
    </section>
  );
}
