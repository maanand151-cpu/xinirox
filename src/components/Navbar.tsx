import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-serif font-bold text-gradient-gold">
          Xini Rox
        </Link>
        <div className="flex items-center gap-8">
          <a href="/#websites" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hidden sm:block tracking-wide">
            Websites
          </a>
          <a href="/#social" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hidden sm:block tracking-wide">
            Social
          </a>
          <Link to="/network" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hidden sm:block tracking-wide">
            Network
          </Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hidden sm:block tracking-wide">
            About Us
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
