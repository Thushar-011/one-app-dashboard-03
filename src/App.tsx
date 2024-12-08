import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WidgetsProvider } from "./hooks/useWidgets";
import LoadingScreen from "./components/LoadingScreen";
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
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <WidgetsProvider>
            {isLoading ? (
              <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
            ) : (
              <>
                <Toaster />
                <Sonner duration={1000} />
                <Routes>
                  <Route path="/" element={<Index />} />
                </Routes>
              </>
            )}
          </WidgetsProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;