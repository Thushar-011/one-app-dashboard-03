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
import { motion } from "framer-motion";

const WIDGET_OPTIONS: Array<{ type: WidgetType; label: string }> = [
  { type: "alarm", label: "Alarm" },
  { type: "todo", label: "To-Do List" },
  { type: "reminder", label: "Reminders" },
  { type: "note", label: "Notes" },
  { type: "expense", label: "Expense Tracker" },
];

// Constants for widget positioning
const INITIAL_Y_POSITION = 20; // Starting position below the ribbon
const WIDGET_VERTICAL_GAP = 20; // Consistent gap between widgets
const WIDGET_HEIGHT = 150; // Standard widget height

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

    // Calculate new widget position
    const newY = widgets.length === 0 
      ? INITIAL_Y_POSITION 
      : Math.max(...widgets.map(w => w.position.y)) + WIDGET_HEIGHT + WIDGET_VERTICAL_GAP;

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
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Add Widget
          </DialogTitle>
        </DialogHeader>
        <motion.div 
          className="grid grid-cols-2 gap-4 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {WIDGET_OPTIONS.map((option, index) => (
            <motion.div
              key={option.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className={`h-20 w-full flex flex-col gap-2 transition-all duration-300 ${
                  widgets.some(w => w.type === option.type) || trashedWidgets.some(w => w.type === option.type)
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 hover:shadow-lg hover:border-primary/50"
                }`}
                onClick={() => handleAddWidget(option.type)}
                disabled={widgets.some(w => w.type === option.type) || trashedWidgets.some(w => w.type === option.type)}
              >
                {option.label}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}