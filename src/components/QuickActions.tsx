import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, X, Bell, Calendar, Settings, MessageSquare } from "lucide-react";

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { icon: Bell, label: "Notifications" },
    { icon: Calendar, label: "Calendar" },
    { icon: MessageSquare, label: "Messages" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-20 left-4 z-50 rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent
        side="left"
        className="w-[280px] sm:w-[320px] bg-card/95 backdrop-blur-lg"
      >
        <div className="grid gap-6 py-6">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="flex items-center gap-3 text-lg justify-start hover:bg-primary/10"
              onClick={() => setIsOpen(false)}
            >
              <action.icon className="h-5 w-5" />
              {action.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}