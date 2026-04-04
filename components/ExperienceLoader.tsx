"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function ExperienceLoader({ name, onComplete }: { name: string; onComplete: () => void }) {
  const [text, setText] = useState("");
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messages = [
      { t: `Bonjour ${name}`, p: "20%" },
      { t: "Merci de nous avoir choisi.", p: "40%" },
      { t: "Athari prépare votre expérience...", p: "70%" },
      { t: "On espère que ça va vous plaire.", p: "90%" },
      { t: "C'est prêt.", p: "100%" }
    ];

    const tl = gsap.timeline();

    // Initialisation
    gsap.set(textRef.current, { opacity: 0, y: 20 });

    messages.forEach((step, i) => {
      const isLast = i === messages.length - 1;
      const startTime = i > 0 ? "+=0.5" : 0.2;

      tl.add(() => {
        if (!textRef.current) return;
        setText(step.t);

        // Animation Entrée Texte
        gsap.fromTo(textRef.current, 
            { opacity: 0, y: 30, filter: "blur(20px)" }, 
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }
        );

        // Animation Barre
        gsap.to(barRef.current, { width: step.p, duration: 1.5, ease: "power2.inOut" });
      }, startTime);

      if (!isLast) {
          tl.to(textRef.current, { 
              opacity: 0, y: -20, filter: "blur(10px)", duration: 0.8, ease: "power2.in" 
          }, `+=${2.2}`);
      }
    });

    // --- REVEAL FINAL (L'OUVERTURE DE L'IRIS) ---
    tl.add(() => {
        const revealTl = gsap.timeline({ onComplete });
        
        // 1. On efface le texte proprement
        revealTl.to([textRef.current, ".loader-decoration"], { 
            opacity: 0, scale: 0.9, duration: 1, ease: "power2.in" 
        });

        // 2. EFFET IRIS : On crée un trou transparent qui s'agrandit
        // On utilise une variable CSS personnalisée '--mask-size' pour GSAP
        revealTl.fromTo(loaderRef.current, 
          { 
            webkitMaskImage: "radial-gradient(circle, transparent 0%, black 0%)",
            maskImage: "radial-gradient(circle, transparent 0%, black 0%)"
          },
          { 
            webkitMaskImage: "radial-gradient(circle, transparent 100%, black 150%)",
            maskImage: "radial-gradient(circle, transparent 100%, black 150%)",
            duration: 3, 
            ease: "expo.inOut" 
          },
          "+=0.2"
        );

        // 3. On finit de cacher le loader au cas où
        revealTl.to(loaderRef.current, { opacity: 0, duration: 0.5 }, "-=0.5");
    }, "+=1");

    return () => { tl.revert(); };
  }, [name, onComplete]);

  return (
    <div 
      ref={loaderRef} 
      className="loader-bg fixed inset-0 z-[600] bg-black flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* Background radial discret */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,#000_100%)] opacity-95 z-0" />
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        
        {/* LOGO ATHARI - Blanc pur avec léger glow luxe */}
        <img 
          src="/athari-blanc-vecto.png" 
          alt="Athari Logo" 
          className="loader-decoration w-24 md:w-36 mb-20 opacity-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] select-none pointer-events-none" 
        />

        {/* TEXTE - Toujours sur une ligne */}
        <div className="overflow-hidden mb-16 w-full flex justify-center">
          <h1 
            ref={textRef} 
            className="text-white text-3xl md:text-7xl font-light italic tracking-tight whitespace-nowrap px-8" 
            style={{ fontFamily: "'Soria', serif" }}
          >
            {text}
          </h1>
        </div>
        
        {/* BARRE DE CHARGEMENT */}
        <div className="loader-decoration w-64 md:w-[650px] h-[1px] bg-white/10 relative">
          <div 
            ref={barRef} 
            className="absolute top-0 left-0 h-full bg-white w-0 shadow-[0_0_20px_white]" 
          />
        </div>
        
        {/* Signature */}
        <div className="loader-decoration mt-24 flex flex-col items-center gap-4 opacity-30">
            <div className="w-12 h-[1px] bg-white" />
            <p className="text-[10px] tracking-[0.8em] uppercase font-bold text-white">
                Athari Experience
            </p>
        </div>
      </div>
    </div>
  );
}