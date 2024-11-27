import { useWidgets } from "@/hooks/useWidgets";
import { ReminderData } from "@/types/widget";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { format } from "date-fns";

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

  const toggleReminder = (e: React.MouseEvent, reminderId: string) => {
    e.stopPropagation();
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
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="space-y-4">
        <Input
          type="text"
          value={newReminderText}
          onChange={(e) => setNewReminderText(e.target.value)}
          placeholder="Reminder text"
          className="flex-1"
        />
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border dark:bg-card"
        />
        <Button 
          onClick={(e) => addReminder(e)}
          disabled={!newReminderText.trim() || !selectedDate}
          className="w-full"
        >
          Add Reminder
        </Button>
      </div>

      <div className="space-y-2">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="widget-list-item flex items-center justify-between p-3 rounded-lg"
          >
            <button
              onClick={(e) => toggleReminder(e, reminder.id)}
              className={`flex-1 text-left ${
                reminder.completed && "text-muted-foreground line-through"
              }`}
            >
              <p>{reminder.text}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(reminder.date), "PPP")}
              </p>
            </button>
            <button
              onClick={(e) => removeReminder(e, reminder.id)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}