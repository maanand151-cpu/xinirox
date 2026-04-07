const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-border/50">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Xini Rox. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
