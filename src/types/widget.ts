export type WidgetType = "alarm" | "todo" | "reminder" | "note" | "expense";

export interface Widget {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data?: any;
}

export interface AlarmData {
  alarms: Array<{
    id: string;
    time: string;
    enabled: boolean;
  }>;
}

export interface TodoData {
  tasks: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

export interface NoteData {
  notes: Array<{
    id: string;
    text: string;
    createdAt: string;
  }>;
}

export interface ReminderData {
  reminders: Array<{
    id: string;
    text: string;
    date: string;
    completed: boolean;
  }>;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string;
}

export interface ExpenseData {
  categories: ExpenseCategory[];
  expenses: Expense[];
}