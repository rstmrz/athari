"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { question: "Est-ce que l'application est gratuite ?", answer: "Oui, nous proposons une version gratuite à vie comprenant toutes les fonctionnalités de base. Des options premium sont disponibles." },
  { question: "Mes données sont-elles en sécurité ?", answer: "Absolument. Nous utilisons un chiffrement de bout en bout de niveau militaire. Tes données t'appartiennent." },
  { question: "Puis-je l'utiliser sur plusieurs appareils ?", answer: "Bien sûr ! Ton compte se synchronise instantanément et automatiquement sur tous tes écrans." },
  { question: "Comment puis-je annuler mon abonnement ?", answer: "Tu peux annuler ton abonnement à tout moment en un seul clic depuis les paramètres de ton compte." }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".faq-item", {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 80%" }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const toggleFaq = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section ref={containerRef} id="faq" className="w-full section-padding bg-background">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="title-section mb-4">Des questions ?</h2>
          <p className="body-text">Tout ce que tu dois savoir sur le produit.</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="faq-item border border-foreground/10 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/50">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-foreground/5 transition-colors"
                >
                  <span className="font-semibold text-lg md:text-xl">{faq.question}</span>
                  <span className="relative w-6 h-6 flex items-center justify-center flex-shrink-0 ml-4">
                    <span className={`absolute w-full h-[2px] bg-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}></span>
                    <span className={`absolute w-full h-[2px] bg-foreground transition-transform duration-300 ${isOpen ? "rotate-0 opacity-0" : "rotate-90"}`}></span>
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 body-text">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}