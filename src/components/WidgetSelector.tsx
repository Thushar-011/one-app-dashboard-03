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

const WIDGET_OPTIONS: Array<{ type: WidgetType; label: string }> = [
  { type: "alarm", label: "Alarm" },
  { type: "todo", label: "To-Do List" },
  { type: "reminder", label: "Reminders" },
  { type: "note", label: "Notes" },
  { type: "expense", label: "Expense Tracker" },
];

export default function WidgetSelector() {
  const { addWidget } = useWidgets();

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
              className="h-20 flex flex-col gap-2"
              onClick={() => {
                addWidget(option.type);
                const dialogClose = document.querySelector(
                  "[data-dialog-close]"
                ) as HTMLButtonElement;
                dialogClose?.click();
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}