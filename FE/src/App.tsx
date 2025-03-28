import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
 

import Navbar from "./components/Navbar";
import { AnimatePresence } from "framer-motion";

import { RecoilRoot } from "recoil";
import AdminComponent from "./pages/AdminComponent";
import Testing from "./components/TestingCompo";

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
                 <Route path="/" element={<Landing />} />
                <Route
                  path="/test"
                  element={
                    
                      <main className="flex-1">
                        <Testing />
                      </main>
                    
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <div className="min-h-screen flex flex-col">
                      <Navbar />
                      <main className="flex-1">
                        <AdminComponent />
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
