const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <div className="mb-6 inline-block">
          <span className="text-sm font-medium tracking-[0.3em] uppercase text-primary/80">
            Business Manager & Entrepreneur
          </span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-bold font-serif mb-6 text-gradient-gold">
          Xini Rox
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A visionary business manager and entrepreneur driving innovation across multiple ventures. 
          Connecting brands, ideas, and people — all in one place.
        </p>

        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="w-12 h-px bg-primary/40" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-12 h-px bg-primary/40" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
