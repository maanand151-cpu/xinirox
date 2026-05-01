import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Globe, Share2, Network, User } from "lucide-react";

const tabs = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Websites", icon: Globe, path: "/websites" },
  { label: "Social", icon: Share2, path: "/social" },
  { label: "Network", icon: Network, path: "/network" },
  { label: "About", icon: User, path: "/about" },
];

const TopNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/60 backdrop-blur-xl border-b border-border/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-serif font-bold text-gradient-gold">
          Xini Rox
        </Link>
        <div className="hidden sm:flex items-center gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>
        <Link to="/" className="sm:hidden text-sm text-muted-foreground">
          ☰
        </Link>
      </div>
    </nav>
  );
};

export default TopNav;
