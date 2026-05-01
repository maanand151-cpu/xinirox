import { ReactNode } from "react";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="pt-16 pb-20 sm:pb-0">
        {children}
      </main>
      <div className="hidden sm:block">
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
};

export default AppShell;
