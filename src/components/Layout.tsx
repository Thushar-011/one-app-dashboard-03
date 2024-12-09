import { Menu } from "lucide-react";
import { useState } from "react";
import SideMenu from "./SideMenu";
import { Button } from "./ui/button";
import WidgetSelector from "./WidgetSelector";
import VoiceControl from "./VoiceControl";
import { Chatbot } from "./Chatbot";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

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
            className="shrink-0 hover:scale-110 transition-transform active:scale-95"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-black mx-auto bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-flow-colors bg-clip-text text-transparent">
            ONE APP
          </h1>
          <div className="flex items-center gap-2">
            <WidgetSelector />
          </div>
        </div>
      </header>

      <main className="pt-16 pb-4 px-4">{children}</main>

      <VoiceControl />

      <Sheet>
        <SheetTrigger asChild>
          <div className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#8B5CF6] text-white rounded-l-lg shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95 z-50">
            <div className="p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L20 12L12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-[70vw] sm:w-[400px] max-w-[95vw] h-[100dvh] overflow-hidden p-0"
        >
          <div className="h-full max-h-[100dvh]">
            <Chatbot />
          </div>
        </SheetContent>
      </Sheet>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}