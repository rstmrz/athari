"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SLIDE_DURATION_MS = 5600;

const slides = [
  {
    id: "xp-1",
    text: "Des les premieres secondes, laissez-vous captiver,",
    media: "/fond/xp-1.mp4",
  },
  {
    id: "xp-2",
    text: "Plongez dans des instants que le temps n'a pas effaces,",
    media: "/fond/xp-2.mp4",
  },
  {
    id: "xp-3",
    text: "Chaque image vous raconte une emotion a revivre,",
    media: "/fond/xp-3.mp4",
  },
  {
    id: "xp-4",
    text: "Decouvrez des maintenant l'experience immersive du souvenir.",
    media: "/fond/xp-4.mp4",
  },
];

export default function Hero({ started = true }: { started?: boolean }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");

  const transitioningRef = useRef(false);

  const current = slides[activeSlide];
  const words = current.text.split(" ");
  const isFinalSlide = activeSlide === slides.length - 1;

  useEffect(() => {
    setActiveSlide(0);
  }, []);

  useEffect(() => {
    if (!started || isFinalSlide) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveSlide((prev) => Math.min(prev + 1, slides.length - 1));
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [activeSlide, isFinalSlide, started]);

  useEffect(() => {
    if (phase === "idle") {
      return;
    }

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [phase]);

  const startSectionTransition = () => {
    if (transitioningRef.current || !isFinalSlide) {
      return;
    }

    transitioningRef.current = true;

    const nextSection = document.getElementById("next-section");
    if (nextSection) {
      const lenis = (window as unknown as Record<string, unknown>).__lenis as
        | { scrollTo: (target: HTMLElement, options?: Record<string, unknown>) => void; start: () => void }
        | undefined;
      if (lenis) {
        lenis.start();
        lenis.scrollTo(nextSection, { duration: 2.2, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
      } else {
        window.scrollTo({ top: nextSection.offsetTop, behavior: "smooth" });
      }
    }

    window.setTimeout(() => {
      transitioningRef.current = false;
    }, 2500);
  };

  return (
    <section id="hero-section" className="relative min-h-screen overflow-hidden bg-black text-white">
      {slides.map((slide, index) => {
        const isActiveSlide = index === activeSlide;
        const isNearSlide = Math.abs(index - activeSlide) <= 1;

        return (
          <motion.section
            key={slide.id}
            aria-hidden={!isActiveSlide}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: isActiveSlide ? 1 : 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: isActiveSlide ? 3 : 1 }}
          >
            {isNearSlide ? (
              <video
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
                className="absolute inset-0 h-full w-full scale-[1.02] object-cover"
              >
                <source src={slide.media} type="video/mp4" />
              </video>
            ) : null}

          </motion.section>
        );
      })}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.04),_transparent_20%),linear-gradient(180deg,rgba(0,0,0,0.58),rgba(0,0,0,0.88))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.08),_transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.45),rgba(0,0,0,0.22),rgba(0,0,0,0.45))]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-8 sm:px-8 lg:px-12">
        <div className="flex w-full items-center justify-center">
          <div className="flex w-full max-w-4xl flex-col items-center text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={`title-${current.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-3xl text-balance text-2xl font-semibold leading-[1.14] tracking-[-0.03em] text-white sm:text-3xl lg:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {words.map((word, index) => (
                  <motion.span
                    key={`${current.id}-${index}-${word}`}
                    className="inline-block"
                    initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 + index * 0.055 }}
                  >
                    {word}
                    {index < words.length - 1 ? "\u00A0" : ""}
                  </motion.span>
                ))}
              </motion.p>
            </AnimatePresence>


          </div>
        </div>
      </div>

      {isFinalSlide ? (
        <motion.button
          type="button"
          onClick={startSectionTransition}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-16 z-20 mx-auto flex w-fit items-center border border-white/15 bg-white/5 px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm transition-all hover:border-amber-300/30 hover:bg-white/10 hover:text-white sm:bottom-20"
          aria-label="Découvrir la suite"
        >
          Découvrir
        </motion.button>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 z-[4] h-[40vh] bg-gradient-to-t from-black via-black/60 to-transparent" />
    </section>
  );
}
