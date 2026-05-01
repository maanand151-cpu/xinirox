import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Globe, Share2, Network, User } from "lucide-react";

const tabs = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Websites", icon: Globe, path: "/websites" },
  { label: "Social", icon: Share2, path: "/social" },
  { label: "Network", icon: Network, path: "/network" },
  { label: "About", icon: User, path: "/about" },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-card/80 backdrop-blur-xl sm:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors duration-200 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${active ? "drop-shadow-[0_0_6px_hsl(43,74%,49%)]" : ""}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
