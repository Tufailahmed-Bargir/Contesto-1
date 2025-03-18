import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Admin from "./pages/Admin";

import Navbar from "./components/Navbar";
import {  AnimatePresence } from "framer-motion";
 
import { RecoilRoot } from "recoil";

const queryClient = new QueryClient();

const App = () => (
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                  path="/dashboard"
                  element={
                    <div className="min-h-screen flex flex-col">
                      <Navbar />
                      <main className="flex-1">
                        <Index />
                      </main>
                    </div>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <div className="min-h-screen flex flex-col">
                      <Navbar />
                      <main className="flex-1">
                        <Admin />
                      </main>
                    </div>
                  }
                />

                 
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </RecoilRoot>
);

export default App;
