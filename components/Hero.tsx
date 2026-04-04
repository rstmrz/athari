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
      // ÉTAT INITIAL : On cache tout sauf la première slide
      // autoAlpha gère l'opacité ET la visibilité (évite les bugs mobiles)
      gsap.set(textRefs.current.slice(1), { autoAlpha: 0, y: 30 });
      gsap.set(videoRefs.current.slice(1), { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", 
          scrub: 1, // Lissage pour éviter les saccades au pouce
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true, // Recalcule si la barre d'adresse mobile bouge
        },
      });

      // Animation des transitions entre slides
      slides.forEach((_, i) => {
        if (i < slides.length - 1) {
          const label = `fade${i}`;
          tl.add(label);

          // Sortie de la slide actuelle
          tl.to(textRefs.current[i], { autoAlpha: 0, y: -40, duration: 1 }, label)
            .to(videoRefs.current[i], { autoAlpha: 0, duration: 1 }, label)
            
          // Entrée de la suivante (avec un léger décalage pour éviter le ghosting)
          tl.to(textRefs.current[i + 1], { autoAlpha: 1, y: 0, duration: 1 }, `${label}+=0.3`)
            .to(videoRefs.current[i + 1], { autoAlpha: 1, duration: 1 }, `${label}+=0.3`);
        }
      });

      // EFFET DE RÉDUCTION FINAL
      tl.to(innerRef.current, {
        scale: 0.92,
        borderRadius: "40px",
        autoAlpha: 0,
        duration: 2,
        ease: "power2.inOut"
      }, "+=0.5");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden">
      <div ref={innerRef} className="relative w-full h-full overflow-hidden bg-black">
        
        {/* VIDEOS DE FOND */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, i) => (
            <video
              key={`video-${slide.id}`}
              ref={(el) => { videoRefs.current[i] = el; }}
              src={slide.video}
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover"
              // On force la visibilité CSS initiale pour la première vidéo seulement
              style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
            />
          ))}
          {/* Overlay sombre pour la lisibilité */}
          <div className="absolute inset-0 bg-black/50 z-10" />
        </div>

        {/* TEXTES CENTREURS */}
        <div className="relative z-20 h-full flex items-center justify-center container-custom">
          {slides.map((slide, i) => (
            <div 
              key={`text-${slide.id}`} 
              ref={(el) => { textRefs.current[i] = el; }} 
              className="absolute w-full text-center px-6 max-w-5xl pointer-events-none"
            >
              {/* Utilisation de slide.title uniquement */}
              <h1 className="text-[clamp(1.8rem,8vw,4.5rem)] font-bold tracking-tighter leading-[1.1] text-white">
                {slide.title}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}