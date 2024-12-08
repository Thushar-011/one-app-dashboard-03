import { Widget } from "@/types/widget";
import { toast } from "sonner";

const parseTimeFromCommand = (text: string): { hour: number, minute: number, isPM: boolean } | null => {
  // Match patterns like "4:30 pm", "4 30 pm", "4.30 pm", "430 pm", "4:30", "4.30"
  const timePattern = /(\d{1,2})[:.\s]*(\d{2})?\s*(am|pm)?/i;
  const match = text.toLowerCase().match(timePattern);
  
  if (!match) return null;
  
  let hour = parseInt(match[1]);
  let minute = match[2] ? parseInt(match[2]) : 0;
  
  // Check if PM is mentioned anywhere in the text
  const isPM = text.toLowerCase().includes('pm');
  
  // Validate hours and minutes
  if (hour < 1 || hour > 12) {
    toast.error("Please specify a valid hour between 1 and 12");
    return null;
  }
  if (minute < 0 || minute > 59) {
    toast.error("Please specify valid minutes between 0 and 59");
    return null;
  }

  return { hour, minute, isPM };
};

export const handleAlarmCommand = async (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
): Promise<boolean> => {
  console.log("Processing alarm command:", text);
  
  // Check if this is an alarm-related command
  if (!text.toLowerCase().includes('alarm') && !text.toLowerCase().includes('wake') && !text.toLowerCase().includes('at')) {
    return false;
  }
  
  const timeInfo = parseTimeFromCommand(text);
  if (!timeInfo) {
    toast.error("Could not understand the time format. Please try again.");
    return false;
  }
  
  const { hour, minute, isPM } = timeInfo;
  
  // Convert to 24-hour format
  let hour24 = hour;
  if (isPM && hour !== 12) hour24 += 12;
  if (!isPM && hour === 12) hour24 = 0;
  
  const time = `${hour24.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  console.log("Setting alarm for:", time, "isPM:", isPM);
  
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
  
  toast.success(`Alarm set for ${hour}:${minute.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`);
  return true;
};