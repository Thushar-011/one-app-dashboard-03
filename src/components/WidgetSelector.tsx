import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWidgets } from "@/hooks/useWidgets";
import { Button } from "./ui/button";
import { WidgetType } from "@/types/widget";
import { toast } from "sonner";

const WIDGET_OPTIONS: Array<{ type: WidgetType; label: string }> = [
  { type: "alarm", label: "Alarm" },
  { type: "todo", label: "To-Do List" },
  { type: "reminder", label: "Reminders" },
  { type: "note", label: "Notes" },
  { type: "expense", label: "Expense Tracker" },
];

export default function WidgetSelector() {
  const { widgets, trashedWidgets, addWidget } = useWidgets();

  const handleAddWidget = (type: WidgetType) => {
    // Check if widget exists in active widgets or trash
    if (widgets.some(widget => widget.type === type)) {
      toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} widget already exists`, {
        duration: 1000,
      });
      return;
    }

    if (trashedWidgets.some(widget => widget.type === type)) {
      toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} widget is in trash. Please restore or clear it from trash first.`, {
        duration: 2000,
      });
      return;
    }

    // Find optimal position for new widget
    const existingPositions = widgets.map(w => w.position.y);
    let newY = 0;
    
    if (existingPositions.length > 0) {
      // Sort positions to find gaps
      const sortedPositions = existingPositions.sort((a, b) => a - b);
      
      // Look for a gap between widgets
      for (let i = 0; i < sortedPositions.length; i++) {
        const currentPos = sortedPositions[i];
        const nextPos = sortedPositions[i + 1];
        
        if (nextPos && nextPos - currentPos >= 170) { // 170 is widget height + margin
          newY = currentPos + 170;
          break;
        }
      }
      
      // If no gap found, place at the end
      if (newY === 0) {
        newY = Math.max(...existingPositions) + 170;
      }
    }

    addWidget(type, { x: 0, y: newY });
    
    const dialogClose = document.querySelector(
      "[data-dialog-close]"
    ) as HTMLButtonElement;
    dialogClose?.click();
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} widget added`, {
      duration: 1000,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {WIDGET_OPTIONS.map((option) => (
            <Button
              key={option.type}
              variant="outline"
              className={`h-20 flex flex-col gap-2 transition-all duration-300 ${
                widgets.some(w => w.type === option.type) || trashedWidgets.some(w => w.type === option.type)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
              }`}
              onClick={() => handleAddWidget(option.type)}
              disabled={widgets.some(w => w.type === option.type) || trashedWidgets.some(w => w.type === option.type)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
