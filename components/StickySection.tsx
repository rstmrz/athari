"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  { id: 1, title: "Un amour infini", desc: "Parce que ses mots soignent tout, laisse-toi porter par ce qu'elle a à te dire..", type: "image", src: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2881&auto=format&fit=crop" },
  { id: 2, title: "La force tranquille", desc: "Pour ces paroles qu'on ne prend pas toujours le temps de dire. Papa prend la parole.", type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 3, title: "Le lien du sang", desc: "Plus que des frères et sœurs, tes premiers amis pour la vie. Ils ont un message pour toi.", type: "image", src: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2831&auto=format&fit=crop" }
];

function PhoneItem({ feature }: { feature: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fadeAudio = (video: HTMLVideoElement, type: "in" | "out") => {
    let vol = video.volume;
    const step = 0.05;
    const interval = setInterval(() => {
      if (type === "out") {
        if (vol > step) { vol -= step; video.volume = vol; } 
        else { video.volume = 0; video.pause(); clearInterval(interval); }
      } else {
        if (vol < 1 - step) { vol += step; video.volume = vol; } 
        else { video.volume = 1; clearInterval(interval); }
      }
    }, 30);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && videoRef.current && isPlaying) {
        setIsPlaying(false);
        fadeAudio(videoRef.current, "out");
      }
    }, { threshold: 0.1 });
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { setIsPlaying(false); fadeAudio(videoRef.current, "out"); } 
    else { setIsPlaying(true); videoRef.current.volume = 0; videoRef.current.play(); fadeAudio(videoRef.current, "in"); }
  };

  return (
    <div ref={wrapperRef} className="relative flex items-center justify-center">
      {feature.type === "video" && (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] md:w-[500px] flex justify-between px-4 md:px-2 z-0 transition-opacity duration-500 ease-in-out ${isPlaying ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-1.5 h-32">
            {[...Array(6)].map((_, i) => <div key={`l-${i}`} className="w-2 bg-primary rounded-full audio-bar" style={{ animationDelay: `${i * 0.1}s` }} />)}
          </div>
          <div className="flex items-center gap-1.5 h-32">
            {[...Array(6)].map((_, i) => <div key={`r-${i}`} className="w-2 bg-primary rounded-full audio-bar" style={{ animationDelay: `${(5 - i) * 0.1}s` }} />)}
          </div>
        </div>
      )}
      <div className="w-[300px] h-[600px] bg-foreground rounded-[40px] border-[8px] border-foreground/10 overflow-hidden shadow-2xl flex flex-col relative z-10 scale-[0.75] sm:scale-[0.8] origin-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-background/20 backdrop-blur-md rounded-b-[15px] z-20"></div>
        <div className="w-full h-full relative bg-zinc-900">
          {feature.type === "image" && <img src={feature.src} alt={feature.title} className="w-full h-full object-cover" />}
          {feature.type === "video" && (
            <>
              <video ref={videoRef} src={feature.src} loop playsInline className="w-full h-full object-cover" />
              <button onClick={togglePlay} className={`absolute inset-0 flex items-center justify-center transition-colors z-10 ${isPlaying ? 'bg-transparent' : 'bg-black/20 hover:bg-black/30'}`}>
                {!isPlaying && <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center"><div className="w-5 h-5 ml-2 border-y-[10px] border-y-transparent border-l-[16px] border-l-white rounded-sm"></div></div>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StickySection({ heroCompleted }: { heroCompleted?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const phoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });
      gsap.set(textRefs.current.slice(1), { opacity: 0, scale: 0.8 });
      gsap.set(phoneRefs.current, { y: "100vh" });
      features.forEach((_, i) => {
        tl.to(phoneRefs.current[i], { y: "0vh", duration: 1 }, `step${i}`);
        tl.to(textRefs.current[i], { opacity: 0, scale: 0.9, duration: 1 }, `step${i}`);
        if (i !== features.length - 1) {
          tl.to(phoneRefs.current[i], { y: "-100vh", duration: 1 }, `transition${i}`);
          tl.to(textRefs.current[i], { opacity: 0, duration: 0.5 }, `transition${i}`);
          tl.to(textRefs.current[i + 1], { opacity: 1, scale: 1, duration: 1 }, `transition${i}`);
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @keyframes soundWave { 0%, 100% { height: 20%; opacity: 0.5; } 50% { height: 100%; opacity: 1; } }
        .audio-bar { animation: soundWave 1s ease-in-out infinite; }
      `}</style>

      {/* next-section est la classe utilisée par le Hero pour l'animation de montée */}
      <motion.section
        ref={containerRef}
        className="next-section relative h-[400vh] w-full bg-black mt-[-1px]"
        initial={{ opacity: 0, y: 50 }}
        animate={heroCompleted ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
      >
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          {features.map((feature, i) => (
            <div key={`text-${feature.id}`} ref={(el) => { textRefs.current[i] = el; }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-0 pointer-events-none pt-[80px] sm:pt-0">
              <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-bold tracking-tighter leading-[1] mb-6 text-white">{feature.title}</h2>
              <p className="text-lg md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">{feature.desc}</p>
            </div>
          ))}
          {features.map((feature, i) => (
            <div key={`phone-container-${feature.id}`} ref={(el) => { phoneRefs.current[i] = el; }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <PhoneItem feature={feature} />
            </div>
          ))}
        </div>
      </motion.section>
    </>
  );
}