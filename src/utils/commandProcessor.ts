import { Widget } from "@/types/widget";
import { handleAlarmCommand } from "./commands/alarmCommands";
import { handleTodoCommand } from "./commands/todoCommands";
import { handleReminderCommand } from "./commands/reminderCommands";
import { handleNoteCommand } from "./commands/noteCommands";
import { handleExpenseCommand } from "./commands/expenseCommands";

export const processCommand = async (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  const lowerText = text.toLowerCase();
  console.log("Processing command:", lowerText);

  if (lowerText.includes("alarm")) {
    handleAlarmCommand(text, widgets, updateWidget, addWidget);
  }
  else if (lowerText.includes("task") || lowerText.includes("todo")) {
    handleTodoCommand(text, widgets, updateWidget, addWidget);
  }
  else if (lowerText.includes("reminder")) {
    handleReminderCommand(text, widgets, updateWidget, addWidget);
  }
  else if (lowerText.includes("note")) {
    handleNoteCommand(text, widgets, updateWidget, addWidget);
  }
  else if (lowerText.includes("expense")) {
    handleExpenseCommand(text, widgets, updateWidget, addWidget);
  }
};