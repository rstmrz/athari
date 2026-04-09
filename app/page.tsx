"use client";

import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const films = [
  {
    id: 1,
    title: "Premiers regards",
    subtitle: "Un instant suspendu, capturé pour toujours.",
    video: "/fond/xp-1.mp4",
  },
  {
    id: 2,
    title: "Souvenirs vivants",
    subtitle: "Replonge dans ces moments qui comptent.",
    video: "/fond/xp-2.mp4",
  },
  {
    id: 3,
    title: "Émotions partagées",
    subtitle: "Chaque seconde raconte une histoire à deux.",
    video: "/fond/xp-3.mp4",
  },
  {
    id: 4,
    title: "L'instant parfait",
    subtitle: "Le souvenir ultime, comme au cinéma.",
    video: "/fond/xp-4.mp4",
  },
];

const gallery = [
  {
    id: 1,
    title: "Architecture intemporelle",
    image: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Ciel étoilé au-dessus du mont Fuji",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Rues animées, parfum d’orient",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [readyToEnter, setReadyToEnter] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  /* ── scroll-driven hero overlay ── */
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end start"],
  });
  const heroOverlay1 = useTransform(heroProgress, [0.1, 0.5], [0, 1]);
  const heroOverlay2 = useTransform(heroProgress, [0.5, 0.95], [0, 1]);

  /* ── scroll-driven typewriter ── */
  const typewriterRef = useRef<HTMLElement>(null);
  const typewriterText = "Parce que chacun d\u2019eux ont une belle intention avec toi.";
  const { scrollYProgress: twProgress } = useScroll({
    target: typewriterRef,
    offset: ["start end", "center center"],
  });
  const visibleCharsMotion = useTransform(twProgress, [0, 1], [0, typewriterText.length]);
  const [visibleChars, setVisibleChars] = useState(0);

  useMotionValueEvent(visibleCharsMotion, "change", (v) => {
    setVisibleChars(Math.round(v));
  });

  /* ── scroll-driven card / text interaction ── */
  const cardSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardSectionRef,
    offset: ["start end", "start 0.3"],
  });
  const textFadeOut = useTransform(cardProgress, [0, 0.6], [1, 0]);
  const textSlideUp = useTransform(cardProgress, [0, 0.6], [0, -80]);
  const cardSlideUp = useTransform(cardProgress, [0, 1], [120, 0]);

  /* ── music fade helpers ── */
  const musicActiveRef = useRef(true); // tracks if music should be playing (false when video player open)

  const fadeMusic = useCallback((direction: "in" | "out", onDone?: () => void) => {
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    const audio = musicRef.current;
    if (!audio) return;
    const target = direction === "in" ? 0.5 : 0;
    const step = direction === "in" ? 0.04 : -0.04;
    const tick = () => {
      const next = audio.volume + step;
      audio.volume = Math.max(0, Math.min(0.5, next));
      const done = direction === "in" ? audio.volume >= target : audio.volume <= 0;
      if (!done) {
        fadeRef.current = requestAnimationFrame(tick);
      } else {
        onDone?.();
      }
    };
    fadeRef.current = requestAnimationFrame(tick);
  }, []);

  // Audio is already playing muted via autoPlay+muted attribute
  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) return;
    const onReady = () => setReadyToEnter(true);
    if (audio.readyState >= 4) {
      onReady();
    } else {
      audio.addEventListener("canplaythrough", onReady, { once: true });
    }
    const fallback = setTimeout(onReady, 3000);
    return () => {
      clearTimeout(fallback);
      audio.removeEventListener("canplaythrough", onReady);
    };
  }, []);

  const handleEnter = useCallback(() => {
    setLoaded(true);
    const audio = musicRef.current;
    if (audio) {
      audio.muted = false;
      audio.currentTime = 1;
      audio.volume = 0.7;
    }
  }, []);

  // Loop music at 44s with fade
  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) return;
    const onTime = () => {
      if (audio.currentTime >= 44 && musicActiveRef.current && audio.volume > 0) {
        fadeMusic("out", () => {
          audio.currentTime = 1;
          if (musicActiveRef.current) {
            audio.volume = 0.7;
          }
        });
      }
    };
    audio.addEventListener("timeupdate", onTime);
    return () => audio.removeEventListener("timeupdate", onTime);
  }, [fadeMusic]);

  const handlePlay = useCallback(() => {
    setExpanded(false);
    setPlaying(true);
    setPaused(false);
    musicActiveRef.current = false;
    if (musicRef.current) musicRef.current.volume = 0;
  }, []);

  const togglePause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPaused(false);
    } else {
      videoRef.current.pause();
      setPaused(true);
    }
  }, []);



  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * videoRef.current.duration;
  }, []);



  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (!paused) setShowControls(false);
    }, 3000);
  }, [paused]);

  useEffect(() => {
    if (playing && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      // smooth RAF-based progress
      const update = () => {
        if (!videoRef.current) return;
        const v = videoRef.current;
        const d = v.duration || 0;
        setCurrentTime(v.currentTime);
        if (d && d !== duration) setDuration(d);
        setProgress(d ? (v.currentTime / d) * 100 : 0);
        rafRef.current = requestAnimationFrame(update);
      };
      rafRef.current = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    if (playing) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      // resume ambient music when video player closes
      if (musicRef.current) {
        musicActiveRef.current = true;
        musicRef.current.currentTime = 1;
        musicRef.current.muted = false;
        musicRef.current.volume = 0.7;
      }
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [playing, duration, fadeMusic]);

  return (
    <main className="bg-[#040507] text-white">
      {/* Ambient music */}
      <audio ref={musicRef} src="/musique-ambiance-fond.mp3" preload="auto" loop muted autoPlay />

      {/* Loading screen */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm uppercase tracking-[0.4em] text-white/40"
            >
              Expérience immersive
            </motion.p>
            <motion.button
              type="button"
              onClick={handleEnter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: readyToEnter ? 1 : 0.3, y: readyToEnter ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              disabled={!readyToEnter}
              className="mt-8 border border-white/20 bg-white/5 px-10 py-4 text-[11px] uppercase tracking-[0.35em] text-white/70 transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-30"
            >
              Entrer
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero pinned + scroll-driven black overlay */}
      <div ref={heroWrapperRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <Hero started={loaded} />
          {/* gradient rising from bottom */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-30"
            style={{
              opacity: heroOverlay1,
              background:
                "linear-gradient(to top, black 0%, transparent 70%)",
            }}
          />
          {/* full black fade */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 bg-black"
            style={{ opacity: heroOverlay2 }}
          />
        </div>
      </div>

      {/* Section 2: Title — scroll-driven typewriter */}
      <section
        ref={typewriterRef}
        id="next-section"
        className="relative flex min-h-screen items-center justify-center bg-black"
      >
        <motion.div className="max-w-2xl px-8 text-center" style={{ opacity: textFadeOut, y: textSlideUp }}>
          <h2
            className="text-3xl font-semibold leading-snug tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {typewriterText.split("").map((char, i) => (
              <span
                key={i}
                className="transition-opacity duration-150"
                style={{ opacity: i < visibleChars ? 1 : 0 }}
              >
                {char}
              </span>
            ))}
          </h2>
        </motion.div>
      </section>

      {/* Section: Card */}
      <section ref={cardSectionRef} className="relative overflow-hidden bg-black pb-16 pt-16 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28">

        <div className="container-custom relative z-10">

          <div className="flex justify-center">
            <motion.div className="group cursor-pointer" onClick={() => setExpanded(true)} style={{ y: cardSlideUp }}>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-[32px] border border-white/10 bg-[#1a3a2a] shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            >
              <div className="flex h-full w-full items-center justify-start overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[0.971]">
                <span
                  className="select-none text-[120px] font-bold leading-none tracking-tight text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-10 sm:text-[160px]"
                >
                  Contexte
                </span>
              </div>
              {/* Video preview */}
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-hover:-rotate-2">
                <div className="aspect-[3/4] w-[55%] overflow-hidden rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                  <video
                    src="/fond/xp-1.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
            </motion.div>
          </div>

          {/* Expanded episode overlay — Netflix style */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
                onClick={() => setExpanded(false)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 60 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 30 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative mx-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-[#141414] shadow-[0_60px_120px_rgba(0,0,0,0.9)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Hero video with gradient overlay */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <video
                      src="/fond/xp-1.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                    {/* Bottom gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#141414] to-transparent" />
                    {/* Title over video */}
                    <div className="absolute bottom-6 left-8 right-8">
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-xs font-medium uppercase tracking-[0.35em] text-white/60"
                      >
                        Épisode 1
                      </motion.p>
                      <motion.h3
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                        className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        Premiers regards
                      </motion.h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-8 pb-8 pt-2">
                    {/* Action buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <button onClick={handlePlay} className="flex items-center gap-2 rounded-md bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.1em] text-black transition-colors duration-200 hover:bg-white/85">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        Lecture
                      </button>
                      <button className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 text-white transition-colors duration-200 hover:border-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                      </button>
                    </motion.div>

                    {/* Meta info */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="mt-5 flex items-center gap-3 text-sm"
                    >
                      <span className="font-semibold text-green-400">98% Match</span>
                      <span className="text-white/50">2024</span>
                      <span className="rounded border border-white/20 px-1.5 py-0.5 text-xs text-white/50">HD</span>
                      <span className="text-white/50">10 min</span>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55, duration: 0.4 }}
                      className="mt-4 text-sm leading-relaxed text-white/70"
                    >
                      Un instant suspendu, capturé pour toujours. Revivez ce moment unique où tout a commencé, dans une ambiance cinématographique qui transcende le quotidien.
                    </motion.p>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setExpanded(false)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#141414] text-white/70 transition-colors hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fullscreen video player */}
          <AnimatePresence>
            {playing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black"
                style={{ cursor: "crosshair" }}
                onClick={() => setPlaying(false)}
              >
                {/* Close cross — top right */}
                <button
                  onClick={() => setPlaying(false)}
                  className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center text-white/50 transition-colors duration-200 hover:text-white"
                >
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" d="M18 6 6 18M6 6l12 12"/></svg>
                </button>

                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative cursor-default overflow-hidden rounded-2xl"
                  style={{ width: "85vw", height: "85vh" }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseMove={resetControlsTimer}
                >
                  <video
                    ref={videoRef}
                    src="/fond/xp-1.mp4"
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain"
                    onClick={togglePause}
                    onLoadedMetadata={() => {
                      if (videoRef.current) setDuration(videoRef.current.duration);
                    }}
                  />

                  {/* Pause icon overlay */}
                  <AnimatePresence>
                    {paused && (
                      <motion.div
                        initial={{ opacity: 0, scale: 1.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.25 }}
                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                      >
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/50">
                          <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Controls bar */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: showControls ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 pb-5 pt-16"
                  >
                    {/* Progress bar — smooth via RAF */}
                    <div
                      ref={progressBarRef}
                      className="group/bar mb-4 h-1 cursor-pointer rounded-full bg-white/20 transition-[height] duration-200 hover:h-2"
                      onClick={handleSeek}
                    >
                      <div
                        className="relative h-full rounded-full bg-white"
                        style={{ width: `${progress}%`, transition: "none" }}
                      >
                        <div className="absolute -right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 scale-0 rounded-full bg-white shadow-lg transition-transform group-hover/bar:scale-100" />
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <button onClick={togglePause} className="text-white transition-opacity hover:opacity-80">
                        {paused ? (
                          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        ) : (
                          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
                        )}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#06070d] py-24 sm:py-32">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300/80">Inspire ta vie</p>
              <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Voyage et inspiration dans un style cinéma.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Découvre Tokyo avec élégance et mystère, dans une landing page qui mêle photo, atmosphère nocturne et détails premium.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button className="inline-flex items-center justify-center rounded-full bg-amber-300 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_24px_60px_rgba(251,146,60,0.2)] transition hover:bg-amber-200">
                  Voir les tours
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-amber-300/40 hover:bg-white/10">
                  Galerie vidéo
                </button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')" }} />
                <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                  <span className="text-xs uppercase tracking-[0.35em] text-white/70">Vidéo exclusive</span>
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/70 text-amber-300">
                      ▶
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-white/70">Regarder</p>
                      <h3 className="text-xl font-semibold text-white">Tokyo sous les étoiles</h3>
                    </div>
                  </div>
                </div>
              </div>

              {gallery.map((item) => (
                <div key={item.id} className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
                  <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
