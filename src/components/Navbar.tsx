import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-serif font-bold text-gradient-gold">
          Xini Rox
        </Link>
        <div className="flex items-center gap-6">
          <a href="#websites" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Websites
          </a>
          <a href="#social" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Social
          </a>
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            About
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
