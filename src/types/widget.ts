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