
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { CryptoProvider } from "./contexts/CryptoContext";
import { ContestProvider } from "./contexts/ContestContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Contests from "./pages/Contests";
import Contest from "./pages/Contest";
import CreateContest from "./pages/CreateContest";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CryptoProvider>
        <ContestProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contests" element={<Contests />} />
                <Route path="/contest/:contestId" element={<Contest />} />
                <Route path="/create-contest" element={<CreateContest />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ContestProvider>
      </CryptoProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
