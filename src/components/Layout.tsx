import { Menu, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import { Button } from "./ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  return (
    <div className="min-h-screen w-full max-w-md mx-auto relative bg-background">
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(true)}
            className="shrink-0"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold mx-auto">ONE APP</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="shrink-0"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </Button>
        </div>
      </header>

      <main className="pt-16 pb-4 px-4">{children}</main>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}