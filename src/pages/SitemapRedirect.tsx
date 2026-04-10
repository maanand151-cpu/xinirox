import { useEffect } from "react";

const SitemapRedirect = () => {
  useEffect(() => {
    window.location.href = `https://lswynjfkkutmttcqoaqo.supabase.co/functions/v1/sitemap`;
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
      Loading sitemap...
    </div>
  );
};

export default SitemapRedirect;
