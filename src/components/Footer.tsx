import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-10 px-4 border-t border-border/20">
      <div className="max-w-6xl mx-auto text-center space-y-3">
        <p className="text-gradient-gold font-serif text-lg">Xini Rox</p>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/websites" className="hover:text-primary">Websites</Link>
          <Link to="/social" className="hover:text-primary">Social</Link>
          <Link to="/network" className="hover:text-primary">Network</Link>
          <Link to="/articles" className="hover:text-primary">Articles</Link>
        </nav>
        <p className="text-[11px] text-muted-foreground/70 max-w-md mx-auto">
          Xini Rox (Aanand Maurya) — Digital entrepreneur from Gorakhpur, India. Founder of Xini Rox Super Hub.
        </p>
        <p className="text-xs text-muted-foreground tracking-widest">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
