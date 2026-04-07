const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 text-gradient-gold">
          About Xini Rox
        </h2>
        <div className="w-16 h-px bg-primary/40 mx-auto mb-8" />
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Xini Rox is a dynamic business manager and entrepreneur with a passion for building and scaling ventures 
          across diverse industries. With a keen eye for opportunity and a commitment to excellence, Xini manages 
          multiple businesses, brands, and digital platforms.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          This hub serves as the central point of connection — bringing together all websites, social media 
          profiles, and ventures under one roof. Whether you're a potential partner, client, or collaborator, 
          everything you need is right here.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
