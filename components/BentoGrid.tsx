"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/all";

gsap.registerPlugin(Flip);

type Show = {
  id: number;
  title: string;
  poster: string;
  desc: string;
  tags: string[];
  videoUrl?: string;
};

const allShows: Show[] = [
  { id: 1, title: "Stranger Things 3", poster: "/posters/poster-1.jfif", desc: "Dans cette adaptation en prise de vues réelles...", tags: ["2026", "13+", "Série", "Action", "Fantastique"] },
  { id: 2, title: "One Piece", poster: "/posters/poster-2.jfif", desc: "Dans cette adaptation en prise de vues réelles...", tags: ["2026", "13+", "Série", "Aventure"] },
  { id: 3, title: "Rostom", poster: "/posters/rostom.png", desc: "Revivez vos meilleurs moments en un clic.", tags: ["2026", "13+", "Série", "Fantastique"] },
  { id: 4, title: "Jihanne", poster: "/posters/jijou.png", desc: "Analysez votre routine en un coup d'œil.", tags: ["2026", "13+", "Série", "Action"] },
  { id: 5, title: "The Bear", poster: "/posters/poster-5.jfif", desc: "Reposez vos yeux avec un noir profond.", tags: ["2026", "13+", "Série", "Aventure"] },
  { id: 6, title: "Peaky Blinders", poster: "/posters/poster-6.jfif", desc: "Partout, tout le temps.", tags: ["2026", "13+", "Série", "Action"] },
  { id: 7, title: "Our Planet", poster: "/posters/poster-7.jfif", desc: "Directement sur votre écran d'accueil.", tags: ["2026", "13+", "Série", "Aventure"] },
];

const row1 = allShows.slice(0, 4);
const row2 = allShows.slice(4, 7);

export default function BentoGrid() {
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [flipPrefix, setFlipPrefix] = useState("desk"); // Pour éviter les conflits d'ID entre mobile et PC
  
  // NOUVEAU : État pour la navigation mobile
  const [mobileIndex, setMobileIndex] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);
  const ficheRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedShow ? "hidden" : "";
  }, [selectedShow]);

  const handleCardClick = (show: Show, e: React.MouseEvent<HTMLDivElement>, prefix: string) => {
    const el = e.currentTarget;
    activeCardRef.current = el;
    const state = Flip.getState(el);

    setSelectedShow(show);
    setFlipPrefix(prefix); // On enregistre si on a cliqué depuis le mobile ou le desktop

    if (modalRef.current) {
      modalRef.current.style.display = "flex";
      requestAnimationFrame(() => {
        if (ficheRef.current) {
          Flip.from(state, {
            duration: 1.1,
            ease: "expo.out",
            targets: ficheRef.current,
            scale: true,
            onStart: () => {
              gsap.to(".marquee-track", { filter: "blur(5px)", duration: 0.3 });
              el.style.opacity = "0";
            },
          });
        }
      });
    }
  };

  const closeModal = () => {
    if (!modalRef.current || !activeCardRef.current) return;
    activeCardRef.current.style.opacity = "1";
    modalRef.current.style.display = "none";
    gsap.to(".marquee-track", { filter: "blur(0px)", duration: 0.3 });
    setIsVideoPlaying(false);
    setSelectedShow(null);
  };

  // Rendu des lignes pour le DESKTOP
  const renderRow = (shows: Show[], speed: string, isOffset = false) => (
    <div className={`flex whitespace-nowrap overflow-hidden py-4 ${isOffset ? 'ml-[-120px]' : ''}`}>
      <div className="marquee-track flex gap-8 animate-marquee" style={{ animationDuration: speed }}>
        {[...shows, ...shows, ...shows].map((show, i) => (
          <div
            key={`desk-${show.id}-${i}`}
            data-flip-id={`desk-${show.id}`} 
            onClick={(e) => handleCardClick(show, e, "desk")}
            className="card relative flex-shrink-0 w-[240px] h-[340px] cursor-pointer bg-zinc-900 border border-white/5 transition-all duration-300 rounded-none overflow-hidden"
          >
            <img src={show.poster} className="w-full h-full object-cover rounded-none" alt="" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="bg-black py-24 overflow-hidden relative">
      <div className="container-custom mb-16 text-center">
        <h2 className="title-section text-white font-bold tracking-tighter text-5xl">Et bien plus encore</h2>
      </div>

      {/* --- VERSION DESKTOP (Marquee défilant) --- */}
      <div className="hidden md:flex flex-col gap-6">
        {renderRow(row1, "40s")}
        {renderRow(row2, "50s", true)}
      </div>

      {/* --- VERSION MOBILE (Slider 2 cards avec flèches) --- */}
      <div className="md:hidden w-full flex flex-col items-center px-4">
        {/* Conteneur du carrousel */}
        <div className="w-full overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            // Mathématiques du slider : 50% de largeur + la moitié du gap
            style={{ transform: `translateX(calc(-${mobileIndex} * (50% + 0.5rem)))`, gap: '1rem' }}
          >
            {allShows.map((show) => (
              <div
                key={`mob-${show.id}`}
                data-flip-id={`mob-${show.id}`}
                onClick={(e) => handleCardClick(show, e, "mob")}
                // w-[calc(50%-0.5rem)] permet d'afficher exactement 2 cartes à l'écran
                className="card relative flex-shrink-0 w-[calc(50%-0.5rem)] h-[280px] cursor-pointer bg-zinc-900 border border-white/5 transition-all duration-300 rounded-none overflow-hidden"
              >
                <img src={show.poster} className="w-full h-full object-cover rounded-none" alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* Flèches de navigation en dessous */}
        <div className="flex gap-6 mt-8">
          <button 
            onClick={() => setMobileIndex(p => Math.max(0, p - 1))}
            disabled={mobileIndex === 0}
            className="w-14 h-14 flex items-center justify-center border border-white/20 rounded-full text-white text-2xl hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            ←
          </button>
          <button 
            onClick={() => setMobileIndex(p => Math.min(allShows.length - 2, p + 1))}
            disabled={mobileIndex >= allShows.length - 2}
            className="w-14 h-14 flex items-center justify-center border border-white/20 rounded-full text-white text-2xl hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            →
          </button>
        </div>
      </div>

      {/* --- LA MODAL / FICHE INFORMATIVE --- */}
      <div 
        ref={modalRef}
        className="fixed inset-0 z-[100] bg-black/95 hidden items-center justify-center p-4 md:p-8 backdrop-blur-3xl"
        onClick={closeModal}
      >
        <div 
          ref={ficheRef}
          data-flip-id={selectedShow ? `${flipPrefix}-${selectedShow.id}` : ""}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl h-[80vh] md:h-[85vh] bg-[#0c0c0c] flex flex-col overflow-hidden shadow-2xl border border-white/10 rounded-none cursor-default"
        >
          {selectedShow && (
            <div className="w-full h-full relative">
              {isVideoPlaying ? (
                <div className="w-full h-full bg-black relative">
                  <video 
                    src="/famille.mp4" 
                    className="w-full h-full object-contain" 
                    controls 
                    autoPlay 
                  />
                  <button 
                    onClick={() => setIsVideoPlaying(false)}
                    className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/80 rounded-full text-white text-2xl z-50 transition-all"
                  >
                    ←
                  </button>
                </div>
              ) : (
                <div className="w-full h-full relative flex flex-col justify-end">
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={selectedShow.poster} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c]/60 via-transparent to-transparent" />
                  </div>

                  <div className="relative z-10 w-full p-8 md:p-16 flex flex-col items-start text-left max-w-3xl">
                    <h3 className="fiche-title">
                      {selectedShow.title}
                    </h3>

                    <div className="flex gap-2 mb-6 flex-wrap">
                      {selectedShow.tags.map((tag, idx) => (
                        <span key={idx} className="bg-zinc-900/90 border border-white/10 text-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-white/90 text-base md:text-lg leading-relaxed mb-8 font-medium drop-shadow-md">
                      {selectedShow.desc}
                    </p>

                    <button 
                      onClick={() => setIsVideoPlaying(true)}
                      className="btn-commencer px-10 py-3 font-bold text-xl flex items-center gap-3 shadow-2xl"
                    >
                      <span className="mt-0.5 uppercase tracking-tighter">Commencer</span>
                      <span className="text-2xl font-normal leading-none -mt-1">{'>'}</span>
                    </button>
                  </div>
                </div>
              )}

              <button 
                onClick={closeModal} 
                className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full text-white text-xl z-50 border border-white/10 transition-all"
              >✕</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}