import { Menu } from "lucide-react";
import { useState } from "react";
import SideMenu from "./SideMenu";
import { Button } from "./ui/button";
import WidgetSelector from "./WidgetSelector";
import VoiceControl from "./VoiceControl";
import QuickActions from "./QuickActions";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <WidgetSelector />
        </div>
      </header>

      <main className="pt-16 pb-4 px-4">{children}</main>

      <VoiceControl />
      <QuickActions />

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}