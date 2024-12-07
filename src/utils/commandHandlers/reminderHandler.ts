import { Widget } from "@/types/widget";
import { parseDate } from "../dateParser";

export const handleReminderCommand = (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  // Extract the reminder text and date using regex
  const reminderPattern = /add (?:a )?reminder\s+(.*?)\s+on\s+(.*)/i;
  const match = text.match(reminderPattern);
  
  if (!match) {
    throw new Error("Could not understand the reminder format. Please use the format: Add a reminder [task] on [date]");
  }

  const [, reminderText, dateText] = match;
  console.log("Extracted reminder text:", reminderText);
  console.log("Extracted date text:", dateText);
  
  if (!reminderText || !dateText) {
    throw new Error("Could not understand the reminder text or date");
  }

  try {
    const parsedDate = parseDate(dateText);
    console.log("Parsed date:", parsedDate);

    let reminderWidget = widgets.find(w => w.type === "reminder");
    if (!reminderWidget) {
      addWidget("reminder", { x: 0, y: 0 });
      reminderWidget = widgets[widgets.length - 1];
    }

    const newReminder = {
      id: Date.now().toString(),
      text: reminderText.trim(),
      date: parsedDate.toISOString(),
      completed: false,
    };

    const updatedReminders = [...(reminderWidget?.data?.reminders || []), newReminder];
    updateWidget(reminderWidget.id, {
      data: { reminders: updatedReminders }
    });

    return true;
  } catch (error) {
    console.error("Error parsing date:", error);
    throw new Error("Could not understand the date format. Please try again with a different format (e.g., 'December 25')");
  }
};