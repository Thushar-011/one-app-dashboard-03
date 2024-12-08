import { Widget } from "@/types/widget";
import { toast } from "sonner";
import { handleReminderCommand } from "./commandHandlers/reminderHandler";

export interface WidgetData {
  alarms?: Array<{ id: string; time: string; enabled: boolean }>;
  tasks?: Array<{ id: string; text: string; completed: boolean }>;
  reminders?: Array<{ id: string; text: string; date: string; completed: boolean }>;
  notes?: Array<{ id: string; text: string; createdAt: string }>;
  categories?: Array<{ id: string; name: string; color: string }>;
  expenses?: Array<{ id: string; amount: number; description: string; categoryId: string; date: string }>;
}

export const processCommand = async (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  const lowerText = text.toLowerCase().trim();
  console.log("Processing command:", lowerText);

  try {
    // Reminder commands - check this first since it's more specific
    if (lowerText.includes("reminder")) {
      console.log("Handling reminder command");
      const success = await handleReminderCommand(text, widgets, updateWidget, addWidget);
      if (success) {
        toast.success("Reminder set successfully");
        return;
      }
    }

    // Enhanced time pattern matching for both hour:minute format and spoken format
    if (lowerText.includes("alarm") || lowerText.includes("wake") || lowerText.includes("remind me at")) {
      // Match patterns like "5:56 pm", "5 56 pm", "five fifty six pm"
      const timePattern = /(\d{1,2})(?::|\s+)?(\d{2})?\s*(am|pm)?/i;
      const timeMatch = lowerText.match(timePattern);

      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        let minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const period = timeMatch[3]?.toLowerCase();

        console.log(`Parsed time components - Hours: ${hours}, Minutes: ${minutes}, Period: ${period}`);

        // Validate hours and minutes
        if (hours < 1 || hours > 12) {
          throw new Error("Please specify a valid hour between 1 and 12");
        }
        if (minutes < 0 || minutes > 59) {
          throw new Error("Please specify valid minutes between 0 and 59");
        }

        // Convert to 24-hour format
        if (period === "pm" && hours < 12) hours += 12;
        if (period === "am" && hours === 12) hours = 0;

        const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        console.log("Setting alarm for:", time);

        let alarmWidget = widgets.find(w => w.type === "alarm");
        if (!alarmWidget) {
          addWidget("alarm", { x: 0, y: 0 });
          alarmWidget = widgets[widgets.length - 1];
        }

        const newAlarm = {
          id: Date.now().toString(),
          time,
          enabled: true,
        };

        const updatedAlarms = [...(alarmWidget?.data?.alarms || []), newAlarm];
        updateWidget(alarmWidget.id, {
          data: { alarms: updatedAlarms }
        });

        toast.success(`Alarm set for ${hours}:${minutes.toString().padStart(2, "0")} ${period?.toUpperCase() || 'AM'}`);
        return;
      }
      
      throw new Error("Could not understand the time format. Please try again with a specific time like '5:56 PM'");
    }

    // Task commands
    else if (lowerText.includes("task") || lowerText.includes("todo") || lowerText.includes("add to list")) {
      const taskText = text.replace(/add (a )?task|todo|to( the)? list/gi, "").trim();
      if (taskText) {
        let todoWidget = widgets.find(w => w.type === "todo");
        if (!todoWidget) {
          addWidget("todo", { x: 0, y: 0 });
          todoWidget = widgets[widgets.length - 1];
        }

        const newTask = {
          id: Date.now().toString(),
          text: taskText,
          completed: false,
        };

        const updatedTasks = [...(todoWidget?.data?.tasks || []), newTask];
        updateWidget(todoWidget.id, {
          data: { tasks: updatedTasks }
        });

        toast.success("Task added successfully");
      } else {
        throw new Error("Could not understand the task description");
      }
    }

    // Reminder commands
    else if (lowerText.includes("reminder") || lowerText.includes("remind me")) {
      return handleReminderCommand(text, widgets, updateWidget, addWidget);
    }

    // Note commands
    else if (lowerText.includes("note") || lowerText.includes("write down")) {
      const noteText = text.replace(/start taking notes|add (a )?note|write down/gi, "").trim();
      if (noteText) {
        let noteWidget = widgets.find(w => w.type === "note");
        if (!noteWidget) {
          addWidget("note", { x: 0, y: 0 });
          noteWidget = widgets[widgets.length - 1];
        }

        const newNote = {
          id: Date.now().toString(),
          text: noteText,
          createdAt: new Date().toISOString(),
        };

        const updatedNotes = [...(noteWidget?.data?.notes || []), newNote];
        updateWidget(noteWidget.id, {
          data: { notes: updatedNotes }
        });

        toast.success("Note added successfully");
      } else {
        throw new Error("Could not understand the note content");
      }
    }

    // Expense commands
    else if (lowerText.includes("expense") || lowerText.includes("spent") || lowerText.includes("cost")) {
      const match = lowerText.match(/(\d+)(?:\s*dollars?)?\s+(?:for|on|under)\s+(.+)/i) ||
                   lowerText.match(/spent\s+(\d+)(?:\s*dollars?)?\s+(?:for|on|under)\s+(.+)/i);
      
      if (match) {
        const amount = parseInt(match[1]);
        const category = match[2].trim();

        let expenseWidget = widgets.find(w => w.type === "expense");
        if (!expenseWidget) {
          addWidget("expense", { x: 0, y: 0 });
          expenseWidget = widgets[widgets.length - 1];
        }

        let categoryId = expenseWidget?.data?.categories?.find(
          (c: any) => c.name.toLowerCase() === category.toLowerCase()
        )?.id;

        if (!categoryId) {
          categoryId = Date.now().toString();
          const newCategory = {
            id: categoryId,
            name: category,
            color: "#" + Math.floor(Math.random()*16777215).toString(16),
          };
          expenseWidget.data.categories = [...(expenseWidget?.data?.categories || []), newCategory];
        }

        const newExpense = {
          id: Date.now().toString(),
          amount,
          description: `Voice command: ${amount} for ${category}`,
          categoryId,
          date: new Date().toISOString(),
        };

        const updatedExpenses = [...(expenseWidget?.data?.expenses || []), newExpense];
        updateWidget(expenseWidget.id, {
          data: {
            categories: expenseWidget.data.categories,
            expenses: updatedExpenses,
          }
        });

        toast.success(`Expense of $${amount} added under ${category}`);
      } else {
        throw new Error("Could not understand the expense amount and category");
      }
    } else {
      throw new Error("Command not recognized. Please try again with a different phrase.");
    }
    
  } catch (error) {
    console.error("Error processing command:", error);
    toast.error(error instanceof Error ? error.message : "Failed to process command");
    throw error;
  }
};
