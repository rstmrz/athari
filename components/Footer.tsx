export default function Footer() {
  return (
    <footer className="w-full bg-foreground text-background pt-32 pb-10 rounded-t-[40px] md:rounded-t-[80px] mt-20">
      <div className="container-custom flex flex-col items-center text-center">
        
        <h2 className="text-[clamp(4rem,15vw,10rem)] font-bold tracking-tighter leading-none mb-10">
          athari.
        </h2>
        <p className="body-text !text-background/70 mb-12 max-w-2xl">
          Offrez à ceux que vous aimez le plus beau des héritages : vos mots.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-32">
          <button className="bg-background text-foreground px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform">
            Rejoignez l'expérience
          </button>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center pt-10 border-t border-background/10 gap-6">
          <p className="text-background/50 font-medium text-sm md:text-base">
            © {new Date().getFullYear()} athari. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-background/50 font-medium text-sm md:text-base">
            <a href="#" className="hover:text-background transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-background transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-background transition-colors">Contact</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}