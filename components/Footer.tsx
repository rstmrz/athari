export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020207] py-16 text-white">
      <div className="container-custom grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300/80">Travel</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Prêt pour votre prochaine escapade ?
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
            Tokyo vous attend avec des itinéraires exclusifs, des nuits mystiques et une atmosphère inoubliable.
          </p>
        </div>

        <div className="grid gap-4 text-white/75">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span>Support</span>
            <a href="#" className="text-white hover:text-amber-300">Contact</a>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span>Galerie</span>
            <a href="#" className="text-white hover:text-amber-300">Voir toutes</a>
          </div>
          <div className="flex items-center justify-between pt-4">
            <span>2026 Travel</span>
            <span className="text-white/70">Tous droits réservés</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
