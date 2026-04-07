"use client"; // <--- TRÈS IMPORTANT

import Hero from "../components/Hero";
import StickySection from "../components/StickySection";
import BentoGrid from "../components/BentoGrid";
import Faq from "../components/Faq";
import Footer from "../components/Footer";
import TreeSection from "@/components/TreeSection";
import HoneymoonSection from "@/components/HoneymoonSection";

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen">
      <div className="opacity-100 visible transition-opacity duration-1000">
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