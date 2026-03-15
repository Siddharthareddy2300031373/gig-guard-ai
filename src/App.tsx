import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav, { SafetyHeader } from "@/components/BottomNav";
import Register from "./pages/Register";
import PolicyPage from "./pages/PolicyPage";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SafetyHeader />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simulate" element={<Simulation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
