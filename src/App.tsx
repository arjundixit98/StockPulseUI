
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import News from "./pages/News";
import MultiGraph from "./pages/MultiGraph";
import Portfolio from "./pages/Portfolio";
import Recommendations from "./pages/Recommendations";
import NotFound from "./pages/NotFound";

import "./index.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter  
        future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }} >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/news" element={<News />} />
          <Route path="/multi-graph" element={<MultiGraph />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/recommendations" element={<Recommendations />} />
      
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
