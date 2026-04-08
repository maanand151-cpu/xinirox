const Footer = () => {
  return (
    <footer className="py-10 px-4 border-t border-border/20">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gradient-gold font-serif text-lg mb-2">Xini Rox</p>
        <p className="text-xs text-muted-foreground tracking-widest">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
