import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import WebsitesPage from "./pages/WebsitesPage";
import SocialPage from "./pages/SocialPage";
import AboutUs from "./pages/AboutUs";
import Network from "./pages/Network";
import SiteDetail from "./pages/SiteDetail";
import ProfileDetail from "./pages/ProfileDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import NotFound from "./pages/NotFound";
import AutoSchema from "./components/AutoSchema";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AutoSchema />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/websites" element={<WebsitesPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/network" element={<Network />} />
          <Route path="/site/:slug" element={<SiteDetail />} />
          <Route path="/profile/:slug" element={<ProfileDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
