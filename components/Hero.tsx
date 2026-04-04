"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  { id: 1, title: "Hello toi, bienvenue dans ton empreinte éternelle.", video: "/famille.mp4" },
  { id: 2, title: "Un écrin sacré, scellé par tes amies fidèles.", video: "/mer.mp4" },
  { id: 3, title: "Ton nouveau départ, porté par nos souvenirs.", video: "/plongée.mp4" },
  { id: 4, title: "Explore ces images, reflets d’un lien précieux.", video: "/surf.mp4" },
];

export default function Hero() {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", 
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
      });

      gsap.set(textRefs.current.slice(1), { opacity: 0, y: 30 });
      gsap.set(videoRefs.current.slice(1), { opacity: 0 });

      // Animation des titres
      slides.forEach((_, i) => {
        if (i < slides.length - 1) {
          tl.to(textRefs.current[i], { opacity: 0, y: -30, duration: 1 }, `fade${i}`)
            .to(videoRefs.current[i], { opacity: 0, duration: 1 }, `fade${i}`)
            .to(textRefs.current[i + 1], { opacity: 1, y: 0, duration: 1 }, `fade${i}`)
            .to(videoRefs.current[i + 1], { opacity: 1, duration: 1 }, `fade${i}`);
        }
      });

      // EFFET DE RÉDUCTION + RÉVÉLATION DE LA SUITE
      tl.to(innerRef.current, {
        scale: 0.9,
        borderRadius: "40px",
        opacity: 0,
        duration: 2,
        ease: "power2.inOut"
      }, "+=0.2")
      // On fait monter la section suivante pour éviter le trou noir/gris
      .to(".next-section", {
        y: "-20vh",
        duration: 2,
        ease: "power2.inOut"
      }, "<");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-black">
      <div ref={innerRef} className="relative w-full h-full overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          {slides.map((slide, i) => (
            <video
              key={`video-${slide.id}`}
              ref={(el) => { videoRefs.current[i] = el; }}
              src={slide.video}
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        <div className="relative z-20 h-full flex items-center justify-center container-custom">
          {slides.map((slide, i) => (
            <div key={`text-${slide.id}`} ref={(el) => { textRefs.current[i] = el; }} className="absolute text-center px-6 max-w-5xl">
              <h1 className="text-[clamp(2.2rem,6vw,5rem)] font-bold tracking-tighter leading-[1.05] text-white">
                {slide.title}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}