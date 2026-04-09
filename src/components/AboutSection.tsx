import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4 text-gradient-gold">
          About Xini Rox
        </h2>
        <div className="divider-gold w-24 mx-auto mb-10" />
        <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-light">
          Xini Rox is a dynamic business manager and entrepreneur with a passion for building and scaling ventures
          across diverse industries. With a keen eye for opportunity and a commitment to excellence, Xini manages
          multiple businesses, brands, and digital platforms.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed font-light mb-8">
          This hub serves as the central point of connection — bringing together all websites, social media
          profiles, and ventures under one roof.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Learn More About Us <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default AboutSection;
