import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function SlidePanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="fixed right-0 top-1/2 -translate-y-1/2 p-1.5 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open slide panel"
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 30% 50%)",
            width: "28px",
            height: "56px",
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
        className="w-[90%] sm:w-[400px] p-0 bg-white"
      >
        <div className="h-full w-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-muted-foreground text-center">
              Empty Panel Content
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}