import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Minus } from "lucide-react";

export default function SlidePanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 p-1.5 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open slide panel"
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 30% 50%)",
            width: "28px",
            height: "56px",
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
            background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
          }}
        >
          <div className="w-[2px] h-4 bg-white/90 mx-auto rounded-full animate-pulse" />
        </button>
      </SheetTrigger>
      <SheetContent 
        className="w-[80%] sm:w-[400px] animate-slide-in-right"
        style={{
          background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
          color: "white"
        }}
      >
        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
          Empty Panel Content
        </div>
      </SheetContent>
    </Sheet>
  );
}