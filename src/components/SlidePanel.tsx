import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GripVertical } from "lucide-react";

export default function SlidePanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 p-2 rounded-l-lg shadow-lg border border-r-0 transition-colors"
          aria-label="Open slide panel"
        >
          <GripVertical className="w-6 h-6 text-gray-600" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-[90%] sm:w-[540px]">
        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
          Empty Panel Content
        </div>
      </SheetContent>
    </Sheet>
  );
}