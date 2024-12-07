import { Widget } from "@/types/widget";
import { toast } from "sonner";

export const handleAlarmCommand = (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  console.log("Processing alarm command:", text);
  
  // Convert text to lowercase for easier matching
  const lowerText = text.toLowerCase();
  
  // Enhanced time pattern matching
  const timePatterns = [
    // Match "8:30 am", "8:30am", "8 30 am", "8 30am"
    /(\d{1,2})(?::|\s)?(\d{1,2})?\s*(am|pm)?/i,
    // Match "8 am", "8am"
    /(\d{1,2})\s*(am|pm)/i,
    // Match "eight thirty am", etc.
    /(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)(?:\s+(?:thirty|fifteen|forty-five))?\s*(am|pm)/i
  ];

  // Word to number mapping
  const wordToNumber: { [key: string]: number } = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12
  };

  // Word to minutes mapping
  const wordToMinutes: { [key: string]: number } = {
    'thirty': 30,
    'fifteen': 15,
    'forty-five': 45
  };

  let hours = 0;
  let minutes = 0;
  let period = '';

  // Try each pattern until we find a match
  for (const pattern of timePatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      console.log("Found time match:", match);
      
      if (match[1] in wordToNumber) {
        hours = wordToNumber[match[1]];
      } else {
        hours = parseInt(match[1]);
      }

      // Handle minutes if present
      if (match[2]) {
        if (match[2] in wordToMinutes) {
          minutes = wordToMinutes[match[2]];
        } else {
          minutes = parseInt(match[2]);
        }
      }

      period = match[match.length - 1]?.toLowerCase();
      break;
    }
  }

  // Validate time components
  if (isNaN(hours) || hours < 1 || hours > 12) {
    console.log("Invalid hours:", hours);
    toast.error("Please specify a valid hour between 1 and 12");
    return;
  }

  if (isNaN(minutes) || minutes < 0 || minutes > 59) {
    minutes = 0;
  }

  // Convert to 24-hour format
  if (period === 'pm' && hours < 12) hours += 12;
  if (period === 'am' && hours === 12) hours = 0;

  const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  console.log("Processed time:", time);

  // Find or create alarm widget
  let alarmWidget = widgets.find(w => w.type === "alarm");
  
  if (!alarmWidget) {
    // Create new alarm widget
    addWidget("alarm", { x: 0, y: 0 });
    alarmWidget = widgets[widgets.length - 1];
  }

  if (alarmWidget) {
    const newAlarm = {
      id: Date.now().toString(),
      time,
      enabled: true,
    };

    const currentAlarms = alarmWidget.data?.alarms || [];
    
    updateWidget(alarmWidget.id, {
      data: { 
        alarms: [...currentAlarms, newAlarm]
      }
    });

    console.log("Alarm set successfully:", { widgetId: alarmWidget.id, alarm: newAlarm });
    toast.success(`Alarm set for ${time}`);
  } else {
    console.error("Failed to create or find alarm widget");
    toast.error("Failed to create alarm widget");
  }
};