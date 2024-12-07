import { Widget } from "@/types/widget";
import { toast } from "sonner";

export const handleAlarmCommand = (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  const timeMatch = text.match(/(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?/i);
  
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const period = timeMatch[3]?.toLowerCase();

    // Convert to 24-hour format
    if (period === "pm" && hours < 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;

    const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    
    // Find existing alarm widget
    let alarmWidget = widgets.find(w => w.type === "alarm");
    
    if (!alarmWidget) {
      // Create new alarm widget
      const widgetId = `alarm-${Date.now()}`;
      const newAlarm = {
        id: Date.now().toString(),
        time,
        enabled: true,
      };

      // First add the widget
      addWidget("alarm", { x: 0, y: 0 });
      
      // Then immediately update it with the alarm data
      updateWidget(widgetId, {
        data: { 
          alarms: [newAlarm]
        }
      });

      console.log("Created new alarm widget with ID:", widgetId);
    } else {
      // Update existing widget
      const currentAlarms = alarmWidget.data?.alarms || [];
      const newAlarm = {
        id: Date.now().toString(),
        time,
        enabled: true,
      };

      updateWidget(alarmWidget.id, {
        data: { 
          alarms: [...currentAlarms, newAlarm]
        }
      });

      console.log("Updated existing alarm widget:", alarmWidget.id);
    }

    console.log("Alarm set for:", time);
    toast.success(`Alarm set for ${time}`);
  } else {
    toast.error("Could not understand the time format");
  }
};