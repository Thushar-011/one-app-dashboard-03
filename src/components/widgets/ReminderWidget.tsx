import { useWidgets } from "@/hooks/useWidgets";
import { ReminderData } from "@/types/widget";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { Plus, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Checkbox } from "../ui/checkbox";

interface ReminderWidgetProps {
  id: string;
  data?: ReminderData;
  isDetailView: boolean;
}

export default function ReminderWidget({ id, data, isDetailView }: ReminderWidgetProps) {
  const { updateWidget } = useWidgets();
  const [newReminderText, setNewReminderText] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();

  const reminders = data?.reminders || [];

  const addReminder = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!newReminderText.trim() || !selectedDate) return;
    
    const newReminder = {
      id: Date.now().toString(),
      text: newReminderText.trim(),
      date: selectedDate.toISOString(),
      completed: false,
    };

    updateWidget(id, {
      data: {
        reminders: [...reminders, newReminder],
      },
    });

    setNewReminderText("");
    setSelectedDate(undefined);
  };

  const removeReminder = (e: React.MouseEvent, reminderId: string) => {
    e.stopPropagation();
    updateWidget(id, {
      data: {
        reminders: reminders.filter((reminder) => reminder.id !== reminderId),
      },
    });
  };

  const toggleReminder = (reminderId: string) => {
    updateWidget(id, {
      data: {
        reminders: reminders.map((reminder) =>
          reminder.id === reminderId
            ? { ...reminder, completed: !reminder.completed }
            : reminder
        ),
      },
    });
  };

  if (!isDetailView) {
    const pendingReminders = reminders.filter((reminder) => !reminder.completed).length;
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/50" />
        {pendingReminders === 0
          ? "No pending reminders"
          : `${pendingReminders} reminder${pendingReminders === 1 ? "" : "s"} pending`}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-4">
          <Input
            type="text"
            value={newReminderText}
            onChange={(e) => setNewReminderText(e.target.value)}
            placeholder="Reminder text"
            className="flex-1"
          />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select reminder date</p>
            </TooltipContent>
          </Tooltip>

          <Button 
            onClick={(e) => addReminder(e)}
            disabled={!newReminderText.trim() || !selectedDate}
            className="w-full"
          >
            Add Reminder
          </Button>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between bg-card p-3 rounded-lg border"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={reminder.id}
                    checked={reminder.completed}
                    onCheckedChange={() => toggleReminder(reminder.id)}
                  />
                  <div className={reminder.completed ? "text-muted-foreground" : ""}>
                    <p className="text-sm">{reminder.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(reminder.date), "PPP")}
                    </p>
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => removeReminder(e, reminder.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove reminder</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}