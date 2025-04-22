import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";

import Navbar from "./components/Navbar";
import { AnimatePresence } from "framer-motion";

import { RecoilRoot } from "recoil";
import AdminComponent from "./pages/AdminComponent";
import Testing from "./components/TestingCompo";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/adminLoginPage";

const queryClient = new QueryClient();

const App = () => (
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <div className="min-h-screen flex flex-col">
                          <Navbar />
                          <main className="flex-1">
                            <Index />
                          </main>
                        </div>
                      </ProtectedRoute>
                    }
                  />
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
                      <ProtectedRoute requireAdmin={true}>
                        <div className="min-h-screen flex flex-col">
                          <Navbar />
                          <main className="flex-1">
                            <AdminComponent />
                          </main>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </RecoilRoot>
);

export default App;
