import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";

// Pages
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import Projects from "./pages/Projects";
import KnowledgeBase from "./pages/KnowledgeBase";
import Meetings from "./pages/Meetings";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const onboardingCompleted = useAppStore((state) => state.onboarding.completed);

  if (!onboardingCompleted) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<Projects />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/meetings/:meetingId" element={<Meetings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/onboarding" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
