"use client"; // <--- TRÈS IMPORTANT

import { useState } from "react"; // <--- L'IMPORT MANQUANT
import Hero from "../components/Hero";
import StickySection from "../components/StickySection";
import BentoGrid from "../components/BentoGrid";
import Faq from "../components/Faq";
import Footer from "../components/Footer";
import TreeSection from "@/components/TreeSection";
import HoneymoonSection from "@/components/HoneymoonSection";
import LoginPage from "../components/LoginPage";
import ExperienceLoader from "../components/ExperienceLoader";

export default function Home() {
  const [step, setStep] = useState<'login' | 'loading' | 'experience'>('login');
  const [userName, setUserName] = useState('');

  return (
    <main className="relative bg-black min-h-screen">
      
      {step === 'login' && (
        <LoginPage onLoginSuccess={(name) => { setUserName(name); setStep('loading'); }} />
      )}

      {step === 'loading' && (
        <ExperienceLoader name={userName} onComplete={() => setStep('experience')} />
      )}

      {/* On garde le contenu en opacité 0 pour qu'il charge en arrière-plan */}
      <div className={`${step === 'experience' ? 'opacity-100 visible' : 'opacity-0 invisible h-0 overflow-hidden'} transition-opacity duration-1000`}>
        <Hero />
        <StickySection />
        <BentoGrid />
        <TreeSection />
        <HoneymoonSection />
        <Faq />
        <Footer />
      </div>
      
    </main>
  );
}