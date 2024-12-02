/**
 * Available widget types in the application
 */
export type WidgetType = "alarm" | "todo" | "reminder" | "note";

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
 * Alarm widget data structure
 */
export interface AlarmData {
  alarms: Array<{
    id: string;
    time: string;
    enabled: boolean;
  }>;
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