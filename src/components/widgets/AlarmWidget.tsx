import { useWidgets } from "@/hooks/useWidgets";
import { useState } from "react";
import AlarmList from "./alarm/AlarmList";
import CompactAlarmView from "./alarm/CompactAlarmView";
import AddAlarmButton from "./alarm/AddAlarmButton";
import AlarmDialog from "./alarm/AlarmDialog";
import { toast } from "sonner";

interface AlarmWidgetProps {
  id: string;
  data?: any;
  isDetailView: boolean;
}

export default function AlarmWidget({ id, data, isDetailView }: AlarmWidgetProps) {
  const { updateWidget } = useWidgets();
  const [showDialog, setShowDialog] = useState(false);
  const alarms = data?.alarms || [];

  const validateTime = (hour: string, minute: string) => {
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    
    if (isNaN(hourNum) || hourNum < 1 || hourNum > 12) {
      toast.error("Please enter a valid hour (1-12)", {
        duration: 1000,
      });
      return false;
    }
    
    if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
      toast.error("Please enter a valid minute (0-59)", {
        duration: 1000,
      });
      return false;
    }
    
    return true;
  };

  const handleSave = (hour: string, minute: string, isPM: boolean) => {
    if (!validateTime(hour, minute)) return;

    // Convert 12-hour format to 24-hour format
    let hour24 = parseInt(hour);
    if (isPM && hour24 !== 12) hour24 += 12;
    if (!isPM && hour24 === 12) hour24 = 0;

    console.log('Saving alarm with hour:', hour, 'isPM:', isPM, 'converted to 24h:', hour24);

    const newAlarm = {
      id: Date.now().toString(),
      time: `${hour24.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`,
      enabled: true,
    };

    updateWidget(id, {
      data: {
        alarms: [...alarms, newAlarm],
      },
    });
    
    toast.success("Alarm set successfully", {
      duration: 1000,
    });
  };

  if (!isDetailView) {
    return <CompactAlarmView alarms={alarms} />;
  }

  return (
    <div className="h-full flex flex-col relative">
      <AlarmList alarms={alarms} widgetId={id} />
      
      <AddAlarmButton onClick={() => setShowDialog(true)} />

      <AlarmDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        onSave={handleSave}
      />
    </div>
  );
}