"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const sequence = [
  { word: "et", font: "'Century Gothic', sans-serif", color: "#ffffff" },
  { word: "maintenant...", font: "'Soria', serif", color: "#d4d4d8", style: "italic" },
  { word: "prépares", font: "'Century Gothic', sans-serif", color: "#ffffff" },
  { word: "tes", font: "'Soria', serif", color: "#a1a1aa", style: "italic" },
  { word: "valises.", font: "'Century Gothic', sans-serif", color: "#eab308" },
];

export default function HoneymoonSection() {
  const mainRef = useRef<HTMLDivElement>(null);
  const introContainerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const dynamicLightRefRed = useRef<HTMLDivElement>(null);
  const dynamicGradientSweepRef = useRef<HTMLDivElement>(null);

  // --- LOGIQUE DU TIMER ---
  const targetDate = new Date(2026, 5, 15, 10, 0, 0).getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- ANIMATION GSAP ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: introContainerRef.current,
          start: "top top",
          end: "+=800%", // Augmenté pour plus de confort au scroll
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // 1. Fond vidéo : Flou -> Net
      tl.to(bgVideoRef.current, { filter: "blur(0px) brightness(0.5)", scale: 1, duration: 15 }, 0);

      // 2. Initialisation : tous les mots à 0
      gsap.set(wordsRef.current, { opacity: 0, scale: 0.8, filter: "blur(20px)" });

      // 3. Boucle de la séquence
      sequence.forEach((item, i) => {
        const wordEl = wordsRef.current[i];
        if (!wordEl) return;

        // On espace chaque mot de 3 unités pour éviter les superpositions
        const startTime = i * 3; 

        // Animation des effets de lumière sur chaque mot
        tl.fromTo(dynamicGradientSweepRef.current, 
          { x: '-100%', opacity: 0 }, 
          { x: '100%', opacity: 0.5, duration: 1.5, ease: "power2.inOut" }, 
          startTime
        );

        // APPARITION DU MOT
        tl.to(wordEl, 
          { 
            opacity: 1, 
            scale: 1, 
            filter: "blur(0px)", 
            duration: 1, 
            ease: "power2.out" 
          },
          startTime
        );

        // DISPARITION DU MOT (Strictement avant le début du suivant)
        tl.to(wordEl, 
          { 
            opacity: 0, 
            scale: 1.4, 
            filter: "blur(20px)", 
            duration: 0.8, 
            ease: "power2.in" 
          },
          startTime + 2.0 // Le mot disparaît à t=2.0, le suivant commence à t=3.0. Sécurité de 1.0.
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative w-full bg-black">
      
      {/* --- SECTION 1 : STORYTELLING --- */}
      <div ref={introContainerRef} className="relative w-full h-screen overflow-hidden">
        <video 
          ref={bgVideoRef} 
          src="/ocean-background.mp4" 
          autoPlay loop muted playsInline 
          className="absolute inset-0 w-full h-full object-cover scale-110" 
          style={{ filter: "blur(20px) brightness(0.1)" }} 
        />
        
        {/* Transition vers la section suivante */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />

        {/* Overlays Lumineux */}
        <div ref={dynamicLightRefRed} className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#be123c_0%,transparent_70%)] mix-blend-color-burn z-10 opacity-20 pointer-events-none" />
        <div ref={dynamicGradientSweepRef} className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mix-blend-screen z-15 pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center z-20">
          {sequence.map((item, i) => (
            <span 
              key={i} 
              ref={(el) => { wordsRef.current[i] = el; }} 
              className="absolute text-center text-white font-black tracking-tighter px-4 text-5xl md:text-9xl" 
              style={{ 
                fontFamily: item.font, 
                color: item.color, 
                fontStyle: item.style || 'normal',
                opacity: 0 // Forcé par défaut
              }}
            >
              {item.word}
            </span>
          ))}
        </div>
      </div>

      {/* --- SECTION 2 : LE VOYAGE & HUBLOT --- */}
      <div className="relative w-full min-h-screen flex items-center bg-[#050505] py-24 md:py-0">
        <div className="relative z-10 container-custom flex flex-col-reverse md:flex-row items-center justify-between w-full gap-16">
          
          {/* GAUCHE : TEXTES ET TIMER */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <span className="text-[#eab308] text-xl md:text-2xl mb-4 block" style={{ fontFamily: "'Soria', serif", fontStyle: "italic" }}>
                Le voyage d'une vie
            </span>
            <h3 className="text-white text-5xl md:text-7xl font-bold mb-6 uppercase tracking-tighter" style={{ fontFamily: "'Century Gothic', sans-serif" }}>
                Bali, Indonésie
            </h3>
            <p className="text-white/70 text-lg md:text-xl max-w-md mb-12 leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                Préparez-vous à écrire le premier chapitre de votre éternité. Entre jungles et plages de sable noir.
            </p>

            <div className="flex justify-center md:justify-start gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                    <span className="text-3xl text-white font-bold" style={{ fontFamily: "'Century Gothic', sans-serif" }}>
                        {value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-white/40 text-[10px] uppercase mt-2 tracking-widest font-bold">
                      {unit === 'days' ? 'Jours' : unit === 'hours' ? 'Heures' : unit === 'minutes' ? 'Min' : 'Sec'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DROITE : LE HUBLOT GEANT */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-[320px] md:w-[580px] aspect-square group scale-110">
              
              {/* Vidéo au centre du hublot */}
              <div className="absolute inset-[12%] z-0 overflow-hidden rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
                <video 
                  src="/mer.mp4" 
                  autoPlay loop muted playsInline 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s] ease-out" 
                />
              </div>

              {/* PNG Hublot par-dessus */}
              <img 
                src="/hublot.png" 
                className="absolute inset-0 z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" 
                alt="Hublot" 
              />

              {/* Reflet de vitre */}
              <div className="absolute inset-[12%] z-20 rounded-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none opacity-40" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}