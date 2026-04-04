"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

// --- CONFIGURATION DE LA SÉQUENCE FLASHCARD ---
// On utilise Century Gothic pour la "titraille" classique et Soria pour les citations/mots en italique.
const sequence = [
  { word: "mais", img: "/posters/poster-1.jfif", top: "15%", left: "10%", width: "w-48 md:w-64", font: "'Century Gothic', sans-serif", color: "#ffffff", style: "normal" },
  { word: "attends...", img: "/posters/poster-2.jfif", top: "55%", left: "65%", width: "w-56 md:w-72", font: "'Soria', serif", color: "#a1a1aa", style: "italic" },
  { word: "ce", img: "/posters/poster-3.jfif", top: "10%", left: "60%", width: "w-40 md:w-56", font: "'Century Gothic', sans-serif", color: "#ffffff", style: "normal" },
  { word: "n'est", img: "/posters/poster-4.jfif", top: "60%", left: "15%", width: "w-52 md:w-64", font: "'Soria', serif", color: "#22c55e", style: "italic" },
  { word: "pas", img: "/posters/poster-5.jfif", top: "35%", left: "5%", width: "w-48 md:w-80", font: "'Century Gothic', sans-serif", color: "#ffffff", style: "normal" },
  { word: "encore", img: "/posters/poster-6.jfif", top: "30%", left: "70%", width: "w-44 md:w-60", font: "'Soria', serif", color: "#d4d4d8", style: "italic" },
  { word: "fini.", img: "/posters/poster-7.jfif", top: "25%", left: "50%", width: "w-64 md:w-96", font: "'Century Gothic', sans-serif", color: "#22c55e", style: "normal", centerImg: true },
];

export default function TreeStorySection() {
  const mainRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const phoneVideoRef = useRef<HTMLVideoElement>(null);
  
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wordsContainerRef.current,
          start: "top top",
          end: "+=500%", 
          scrub: 1,
          pin: true,
        }
      });

      sequence.forEach((item, i) => {
        const wordEl = wordsRef.current[i];
        const imgEl = imagesRef.current[i];
        
        const stepLabel = `step${i}`;
        const outLabel = `out${i}`;

        // 1. APPARITION
        tl.fromTo(wordEl, { opacity: 0, filter: "blur(20px)", scale: 0.8 }, { opacity: 1, filter: "blur(0px)", scale: 1, duration: 1 }, stepLabel);
        tl.fromTo(imgEl, 
          { opacity: 0, filter: "blur(15px)", scale: 0.8, y: 100, rotation: gsap.utils.random(-5, 5) }, 
          { opacity: 0.4, filter: "blur(0px)", scale: 1, y: -20, rotation: 0, duration: 1 }, 
          stepLabel
        );
        
        // 2. DISPARITION
        tl.to(wordEl, { opacity: 0, filter: "blur(15px)", scale: 1.3, duration: 1 }, outLabel);
        tl.to(imgEl, { opacity: 0, filter: "blur(20px)", scale: 1.1, y: -80, duration: 1 }, outLabel);
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isInfoOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isInfoOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && phoneVideoRef.current) {
          phoneVideoRef.current.pause();
          setIsVideoPlaying(false);
        }
      },
      { threshold: 0.1 }
    );
    if (phoneVideoRef.current) observer.observe(phoneVideoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={mainRef} className="relative w-full">
      
      {/* =========================================
          SECTION 1 : LES MOTS & IMAGES FLASH
          ========================================= */}
      <div ref={wordsContainerRef} className="relative bg-black h-screen overflow-hidden">
        
        <div className="absolute inset-0 pointer-events-none z-10">
          {sequence.map((item, i) => (
            <img 
              key={`img-${i}`}
              ref={(el) => { imagesRef.current[i] = el; }}
              src={item.img}
              alt=""
              className={`absolute object-cover opacity-0 ${item.width} h-auto shadow-2xl`}
              style={{ 
                top: item.top, 
                left: item.centerImg ? '50%' : item.left, 
                transform: item.centerImg ? 'translateX(-50%)' : 'none' 
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {sequence.map((item, i) => (
            <span 
              key={`word-${i}`} 
              ref={(el) => { wordsRef.current[i] = el; }} 
              className="absolute text-5xl md:text-8xl font-black tracking-tighter opacity-0" 
              style={{ 
                fontFamily: item.font, 
                color: item.color,
                fontStyle: item.style
              }}
            >
              {item.word}
            </span>
          ))}
        </div>
      </div>

      {/* =========================================
          SECTION 2 : LA FORÊT & LE TÉLÉPHONE
          ========================================= */}
      <div className="relative w-full min-h-screen flex items-center bg-black overflow-hidden py-24 md:py-0">
        <div className="absolute inset-0 z-0">
          <video src="/fond-humanitaire.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50" />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black via-black/60 to-transparent" />

        <div className="relative z-20 container-custom flex flex-col md:flex-row items-center justify-between w-full gap-12">
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <div 
              className="relative w-[280px] md:w-[320px] h-[560px] md:h-[650px] border-[14px] border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl bg-black cursor-pointer group" 
              onClick={() => {
                if (phoneVideoRef.current) {
                  if (isMuted) {
                    phoneVideoRef.current.muted = false;
                    setIsMuted(false);
                    phoneVideoRef.current.play();
                    setIsVideoPlaying(true);
                  } else {
                    if (phoneVideoRef.current.paused) {
                      phoneVideoRef.current.play();
                      setIsVideoPlaying(true);
                    } else {
                      phoneVideoRef.current.pause();
                      setIsVideoPlaying(false);
                    }
                  }
                }
              }}
            >
              <div className="absolute top-0 inset-x-0 h-6 w-1/3 bg-zinc-900 rounded-b-2xl mx-auto z-30"></div>
              <video ref={phoneVideoRef} src="/Video_arbre.mp4" autoPlay loop muted={isMuted} playsInline className="w-full h-full object-cover transition-opacity" style={{ opacity: isVideoPlaying ? 1 : 0.6 }} />
              
              {!isVideoPlaying && (
                <div className="absolute inset-0 z-40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white text-3xl pb-1 pl-1">
                    ▶
                  </div>
                </div>
              )}

              {isVideoPlaying && isMuted && (
                <div className="absolute bottom-6 right-6 z-40 bg-black/40 hover:bg-black/70 p-3 rounded-full backdrop-blur-md border border-white/10 text-white transition-all shadow-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
            {/* Titre en Century Gothic */}
            <h3 className="text-white text-4xl md:text-6xl font-bold mb-6 tracking-tighter" style={{ fontFamily: "'Century Gothic', sans-serif" }}>
              Un arbre à ton nom.
            </h3>
            {/* Paragraphe en Open Sans */}
            <p className="text-white/80 text-lg md:text-xl max-w-md leading-relaxed font-medium mb-10" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              Parce que ce projet a des racines, nous en avons planté de vraies pour toi. 
            </p>
            
            {/* Bouton gardé avec une police d'interface lisible, ou Century Gothic */}
            <button 
              onClick={() => setIsInfoOpen(true)}
              className="px-8 py-4 font-bold text-lg uppercase tracking-widest flex items-center gap-3 border border-white/30 text-white transition-all duration-300 hover:bg-[#22c55e] hover:border-[#22c55e] hover:text-black hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
              style={{ fontFamily: "'Century Gothic', sans-serif" }}
            >
              Voir les coordonnées
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          MODAL / FICHE INFORMATIVE FRUTOPY
          ========================================= */}
      {isInfoOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-2xl" 
          onClick={() => setIsInfoOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl max-h-[90vh] md:max-h-[80vh] bg-[#0c0c0c] border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-2xl" 
            onClick={e => e.stopPropagation()} 
          >
            <button 
              onClick={() => setIsInfoOpen(false)} 
              className="absolute top-4 right-4 z-50 text-white/50 hover:text-white bg-black/50 hover:bg-black rounded-full w-10 h-10 flex items-center justify-center transition-all text-2xl pb-1"
              aria-label="Fermer"
            >
              ×
            </button>

            <div className="w-full h-[30vh] shrink-0 md:w-1/2 md:h-auto md:aspect-square bg-zinc-900 relative">
              <img 
                src="mada zofia.png" 
                className="absolute inset-0 w-full h-full object-cover opacity-80" 
                alt="Map Frutopy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent md:hidden" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0c0c0c] hidden md:block" />
            </div>

            <div className="flex-1 p-6 md:p-12 flex flex-col justify-center items-start overflow-y-auto no-scrollbar">
              <span className="text-[#22c55e] font-bold tracking-widest uppercase text-xs md:text-sm mb-4" style={{ fontFamily: "'Century Gothic', sans-serif" }}>
                le concept frutopy
              </span>
              
              {/* Titre principal de la modale en Century Gothic */}
              <h4 className="text-white text-5xl md:text-6xl font-black uppercase mb-6 tracking-tighter" style={{ fontFamily: "'Century Gothic', sans-serif" }}>
                frutopy.
              </h4>
              
              {/* Le contenu de la fiche en Open Sans */}
              <div className="space-y-6 text-white/70 text-base md:text-lg leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                <p>
                  <strong className="text-white">Localisation :</strong> 4°43'29.0"N 74°02'22.0"W <br/>
                  Forêt de la Mesa, Colombie.
                </p>
                <p>
                  Frutopy n'est pas qu'un nom, c'est une mission. Pour chaque membre de notre communauté, un arbre fruitier est planté. Ce geste permet de soutenir l'écosystème local et d'offrir des ressources durables aux populations.
                </p>
                <p>
                  Ton arbre est là, il grandit avec nous. Merci de faire partie de l'aventure.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}