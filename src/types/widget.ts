/**
 * Available widget types in the application
 */
export type WidgetType = "alarm" | "todo" | "reminder" | "note" | "expense";

/**
 * Base widget interface
 * Defines common properties for all widgets
 */
export interface Widget {
  id: string;                     // Unique identifier
  type: WidgetType;              // Widget type
  position: { x: number; y: number };  // Position on dashboard
  size: { width: number; height: number };  // Widget dimensions
  data?: any;                    // Widget-specific data
}

/**
 * Individual alarm configuration
 */
export interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  label?: string;
  repeat?: string[];
  sound?: string;
  vibrate?: boolean;
  snoozeEnabled?: boolean;
  snoozeInterval?: number;
  isAM?: boolean;
  isPM?: boolean;
}

/**
 * Alarm widget data structure
 */
export interface AlarmData {
  alarms: Alarm[];
}

/**
 * Todo widget data structure
 */
export interface TodoData {
  tasks: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

/**
 * Note widget data structure
 */
export interface NoteData {
  notes: Array<{
    id: string;
    text: string;
    createdAt: string;
  }>;
}

/**
 * Reminder widget data structure
 */
export interface ReminderData {
  reminders: Array<{
    id: string;
    text: string;
    date: string;
    completed: boolean;
  }>;
}

/**
 * Expense category definition
 */
export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
}

/**
 * Individual expense entry
 */
export interface Expense {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string;
}

/**
 * Expense widget data structure
 */
export interface ExpenseData {
  categories: ExpenseCategory[];
  expenses: Expense[];
}
