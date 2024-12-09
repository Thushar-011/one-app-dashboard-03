import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Chatbot } from "./Chatbot";

export default function SlidePanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="fixed right-0 top-1/2 -translate-y-1/2 p-1.5 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open slide panel"
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 30% 50%)",
            width: "24px",
            height: "48px",
            background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px"
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-4 bg-white/90 rounded-full animate-pulse" />
        </button>
      </SheetTrigger>
      <SheetContent 
        side="right"
        className="w-[70vw] sm:w-[400px] max-w-[95vw] h-[100dvh] overflow-hidden p-0 bg-white/95 backdrop-blur-md border-l shadow-xl"
      >
        <div className="h-full max-h-[100dvh] relative">
          <Chatbot />
        </div>
      </SheetContent>
    </Sheet>
  );
}