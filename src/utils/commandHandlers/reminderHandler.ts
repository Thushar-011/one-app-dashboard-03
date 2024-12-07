import { Widget } from "@/types/widget";
import { parseDate } from "../dateParser";

export const handleReminderCommand = (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  const datePattern = /on\s+(\w+\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?)/i;
  const match = text.match(datePattern);
  
  if (!match) {
    throw new Error("Could not understand the date. Please specify a date (e.g., 'on December 25')");
  }

  const dateText = match[1];
  console.log("Extracted date text:", dateText);
  
  const reminderText = text
    .replace(/set (a )?reminder|remind me( to)?/gi, "")
    .replace(/on\s+\w+\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?/i, "")
    .trim();

  if (!reminderText) {
    throw new Error("Could not understand the reminder description");
  }

  let reminderWidget = widgets.find(w => w.type === "reminder");
  if (!reminderWidget) {
    addWidget("reminder", { x: 0, y: 0 });
    reminderWidget = widgets[widgets.length - 1];
  }

  try {
    const parsedDate = parseDate(dateText);

    const newReminder = {
      id: Date.now().toString(),
      text: reminderText,
      date: parsedDate.toISOString(),
      completed: false,
    };

    const updatedReminders = [...(reminderWidget?.data?.reminders || []), newReminder];
    updateWidget(reminderWidget.id, {
      data: { reminders: updatedReminders }
    });

    console.log("Added reminder:", newReminder);
    return true;
  } catch (error) {
    console.error("Error parsing date:", error);
    throw new Error("Could not understand the date format. Please try again with a different format (e.g., 'December 25')");
  }
};