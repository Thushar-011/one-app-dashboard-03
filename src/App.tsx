import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WidgetsProvider } from "./hooks/useWidgets";
import Index from "./pages/Index";

// Initialize React Query client for data fetching and caching
const queryClient = new QueryClient();

/**
 * Root Application Component
 * Sets up core providers and routing:
 * - QueryClientProvider: For data fetching and caching
 * - TooltipProvider: For UI tooltips
 * - WidgetsProvider: Custom context for widget management
 * - Toaster components: For notifications
 * - React Router: For page routing
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WidgetsProvider>
        <Toaster />
        <Sonner duration={1000} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </WidgetsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;