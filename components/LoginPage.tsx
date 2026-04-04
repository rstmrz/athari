"use client";

import { useState } from "react";
import gsap from "gsap";

interface LoginPageProps {
  onLoginSuccess: (name: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulation de validation : n'importe quel nom + code "1234"
    if (name.length > 1 && code === "1234") {
      setIsError(false);
      // Animation de sortie fluide avant de passer au loader
      gsap.to(".login-box", { 
        opacity: 0, 
        y: -20, 
        duration: 0.8, 
        ease: "power2.inOut",
        onComplete: () => onLoginSuccess(name) 
      });
    } else {
      setIsError(true);
      // Effet de secousse (Shake) sans erreur TypeScript
      gsap.to(".login-box", {
        keyframes: {
          x: [-10, 10, -10, 10, 0],
        },
        duration: 0.4,
        ease: "none"
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-black flex items-center justify-center p-6 overflow-hidden">
      
      {/* Fond avec une légère aura centrale pour l'effet "Espace" */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,#000_100%)] opacity-60" />
      
      {/* Particules ou étoiles subtiles (optionnel) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />

      <div className="login-box relative z-10 w-full max-w-[400px] text-center">
        
        <h2 
          className="text-white text-3xl font-bold mb-10 tracking-[0.2em] uppercase" 
          style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
          Connexion
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Nom d'utilisateur" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-center"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            />
          </div>

          <div className="relative">
            <input 
              type="password" 
              placeholder="Code secret" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-center"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            />
          </div>

          {isError && (
            <p className="text-red-500 text-xs uppercase tracking-widest mt-2 animate-pulse">
              Identifiants incorrects
            </p>
          )}

          <button 
            type="submit"
            className="w-full bg-white text-black font-bold py-4 rounded-full mt-4 hover:bg-zinc-200 active:scale-95 transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            style={{ fontFamily: "'Century Gothic', sans-serif" }}
          >
            Se connecter
          </button>
        </form>

        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="w-8 h-[1px] bg-white/20" />
          <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase font-bold">
            Powered by Ahari
          </p>
        </div>
      </div>
    </div>
  );
}