import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Minus } from "lucide-react";

export default function SlidePanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 p-1.5 shadow-lg transition-colors"
          aria-label="Open slide panel"
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 20% 50%)",
            width: "24px",
            height: "48px",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px"
          }}
        >
          <Minus className="w-3 h-3 text-white ml-1" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-[80%] sm:w-[400px]">
        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
          Empty Panel Content
        </div>
      </SheetContent>
    </Sheet>
  );
}