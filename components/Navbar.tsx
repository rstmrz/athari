"use client";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center h-20 pointer-events-none">
      
      {/* L'ID nav-bg permet au Hero de piloter l'opacité directement */}
      <div 
        id="nav-bg"
        className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-white/10 transition-opacity duration-300"
        style={{ opacity: 0 }}
      />

      {/* LOGO avec inversion de couleur */}
      <div className="relative z-10 font-bold text-2xl tracking-tighter mix-blend-difference text-white pointer-events-auto cursor-pointer">
        STICKY.
      </div>
      
    </nav>
  );
}