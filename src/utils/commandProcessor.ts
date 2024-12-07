import { Widget } from "@/types/widget";
import { handleAlarmCommand } from "./commands/alarmCommands";
import { handleTodoCommand } from "./commands/todoCommands";
import { handleReminderCommand } from "./commands/reminderCommands";
import { handleNoteCommand } from "./commands/noteCommands";
import { handleExpenseCommand } from "./commands/expenseCommands";
import { toast } from "sonner";

export const processCommand = async (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  const lowerText = text.toLowerCase();
  console.log("Processing command:", lowerText);

  // Enhanced command detection patterns
  const patterns = {
    alarm: /(set|create|add|make)?\s*(an?\s*)?alarm\s*(for|at)?/i,
    todo: /(add|create|make)?\s*(an?\s*)?(task|todo)/i,
    reminder: /(set|create|add|make)?\s*(an?\s*)?reminder/i,
    note: /(take|create|add|make)?\s*(an?\s*)?note/i,
    expense: /(add|log|record)?\s*(an?\s*)?expense/i
  };

  if (patterns.alarm.test(lowerText)) {
    console.log("Detected alarm command");
    handleAlarmCommand(text, widgets, updateWidget, addWidget);
  }
  else if (patterns.todo.test(lowerText)) {
    console.log("Detected todo command");
    handleTodoCommand(text, widgets, updateWidget, addWidget);
  }
  else if (patterns.reminder.test(lowerText)) {
    console.log("Detected reminder command");
    handleReminderCommand(text, widgets, updateWidget, addWidget);
  }
  else if (patterns.note.test(lowerText)) {
    console.log("Detected note command");
    handleNoteCommand(text, widgets, updateWidget, addWidget);
  }
  else if (patterns.expense.test(lowerText)) {
    console.log("Detected expense command");
    handleExpenseCommand(text, widgets, updateWidget, addWidget);
  } else {
    console.log("No matching command pattern found");
    toast.error("I couldn't understand that command. Please try again.");
  }
};