import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const userName = "Prénom";

const messageSteps = [
  {
    title: "Un voyage cinématographique",
    copy: "Chaque plan est pensé comme une scène, chaque mot comme un générique.",
    video: "/famille.mp4"
  },
  {
    title: "Ambiance luxe et suspense",
    copy: "Une expérience immersive entre noir brillant et lueur rouge velours.",
    video: "/mer.mp4"
  },
  {
    title: "Ton film commence maintenant",
    copy: "Trois messages se succèdent pour ouvrir un récit exclusif et intime.",
    video: "/plongée.mp4"
  }
];

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

const messageVariants = {
  enter: { opacity: 0, scale: 0.8, y: 100 },
  center: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: -100 }
};

export default function Hero() {
  const [stage, setStage] = useState<"intro" | "message" | "final" | "exit">("intro");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (stage === "intro") {
      const timer = window.setTimeout(() => setStage("message"), 3000);
      return () => window.clearTimeout(timer);
    }

    if (stage === "message") {
      setActiveIndex(0);
      const timers = [
        window.setTimeout(() => setActiveIndex(1), 5000),
        window.setTimeout(() => setActiveIndex(2), 10000),
        window.setTimeout(() => setStage("final"), 15000),
      ];
      return () => timers.forEach((id) => window.clearTimeout(id));
    }

    if (stage === "final") {
      const timer = window.setTimeout(() => setStage("exit"), 4000);
      return () => window.clearTimeout(timer);
    }
  }, [stage]);

  return (
    <AnimatePresence mode="wait">
      {stage !== "exit" && (
        <motion.section
          className="relative min-h-screen overflow-hidden bg-black text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {stage === "intro" && (
              <video
                src="/famille.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover opacity-20"
              />
            )}
            {stage === "message" && (
              <video
                key={messageSteps[activeIndex].video}
                src={messageSteps[activeIndex].video}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_35%)]" />
          </div>

          <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20">
            <div className="mx-auto max-w-4xl text-center">
              <AnimatePresence mode="wait">
                {stage === "intro" && (
                  <motion.div
                    key="intro"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <motion.span
                      className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.42em] text-white/70"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      Bienvenue {userName}
                    </motion.span>
                    <motion.h1
                      className="mt-8 text-5xl font-serif leading-[0.9] text-white sm:text-6xl md:text-7xl"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 1 }}
                    >
                      Entre dans une autre dimension.
                    </motion.h1>
                    <motion.p
                      className="mt-6 max-w-2xl text-lg text-white/70 sm:text-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5, duration: 1 }}
                    >
                      Un voyage cinématique entre luxe et film. Le texte se dévoile comme un prologue, l'expérience commence maintenant.
                    </motion.p>
                  </motion.div>
                )}

                {stage === "message" && (
                  <motion.div
                    key={`message-${activeIndex}`}
                    variants={messageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="mx-auto max-w-3xl"
                  >
                    <motion.div
                      className="mb-4 text-[11px] uppercase tracking-[0.35em] text-amber-200/80"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Message {activeIndex + 1}
                    </motion.div>
                    <motion.h2
                      className="text-4xl font-semibold text-white sm:text-5xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    >
                      {messageSteps[activeIndex].title}
                    </motion.h2>
                    <motion.p
                      className="mt-6 text-lg leading-8 text-white/70"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    >
                      {messageSteps[activeIndex].copy}
                    </motion.p>
                    <motion.div
                      className="mt-8 flex justify-center gap-3 text-xs uppercase tracking-[0.28em] text-white/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                    >
                      <span>Immersion</span>
                      <span>Film</span>
                      <span>Luxe</span>
                    </motion.div>
                  </motion.div>
                )}

                {stage === "final" && (
                  <motion.div
                    key="final"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative"
                  >
                    <motion.div
                      className="absolute left-0 top-0 h-28 w-full bg-black"
                      initial={{ y: -112 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute left-0 bottom-0 h-28 w-full bg-black"
                      initial={{ y: 112 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                    <div className="relative z-10">
                      <motion.div
                        className="mx-auto mb-10 h-2 w-48 animate-pulse rounded-full bg-white/80"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                      />
                      <motion.p
                        className="text-sm uppercase tracking-[0.38em] text-white/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        Chargement du film
                      </motion.p>
                      <motion.h2
                        className="mt-6 text-5xl font-serif text-white sm:text-6xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2, duration: 1 }}
                      >
                        Ton histoire commence maintenant
                      </motion.h2>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
