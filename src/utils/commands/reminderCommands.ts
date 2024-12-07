import { Widget } from "@/types/widget";
import { toast } from "sonner";

export const handleReminderCommand = (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  const reminderText = text.replace(/set (a )?reminder/i, "").trim();
  if (reminderText) {
    let reminderWidget = widgets.find(w => w.type === "reminder");
    if (!reminderWidget) {
      addWidget("reminder", { x: 0, y: 0 });
      reminderWidget = widgets[widgets.length - 1];
    }

    if (reminderWidget) {
      const newReminder = {
        id: Date.now().toString(),
        text: reminderText,
        date: new Date().toISOString(),
        completed: false,
      };

      const updatedReminders = [...(reminderWidget?.data?.reminders || []), newReminder];
      updateWidget(reminderWidget.id, {
        data: { reminders: updatedReminders }
      });

      toast.success("Reminder added successfully");
    }
  }
};