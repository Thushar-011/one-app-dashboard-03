import { Widget } from "@/types/widget";
import { parseDate } from "../dateParser";
import { toast } from "sonner";

export const handleReminderCommand = async (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  try {
    // Extract the reminder text and date using regex
    const reminderPattern = /add (?:a )?reminder\s+(.*?)\s+(?:for|on)\s+(.*)/i;
    const match = text.match(reminderPattern);
    
    console.log("Processing reminder command:", text);
    console.log("Regex match result:", match);
    
    if (!match) {
      console.log("Could not match reminder pattern");
      throw new Error("Could not understand the reminder format. Please use the format: Add a reminder [task] on [date]");
    }

    const [, reminderText, dateText] = match;
    
    // Clean up the reminder text
    const cleanedReminderText = reminderText
      .replace(/^to\s+/i, '')  // Remove leading "to" if present
      .trim();
      
    console.log("Cleaned reminder text:", cleanedReminderText);
    console.log("Date text:", dateText);
    
    if (!cleanedReminderText || !dateText) {
      console.log("Missing reminder text or date");
      throw new Error("Could not understand the reminder text or date");
    }

    const parsedDate = parseDate(dateText);
    console.log("Parsed date:", parsedDate);

    let reminderWidget = widgets.find(w => w.type === "reminder");
    if (!reminderWidget) {
      console.log("Creating new reminder widget");
      addWidget("reminder", { x: 0, y: 0 });
      reminderWidget = widgets[widgets.length - 1];
    }

    const newReminder = {
      id: Date.now().toString(),
      text: cleanedReminderText,
      date: parsedDate.toISOString(),
      completed: false,
    };

    console.log("Creating new reminder:", newReminder);

    const updatedReminders = [...(reminderWidget?.data?.reminders || []), newReminder];
    updateWidget(reminderWidget.id, {
      data: { reminders: updatedReminders }
    });

    toast.success(`Reminder "${cleanedReminderText}" set for ${parsedDate.toLocaleDateString()}`);
    return true;
  } catch (error) {
    console.error("Error in handleReminderCommand:", error);
    throw error;
  }
};