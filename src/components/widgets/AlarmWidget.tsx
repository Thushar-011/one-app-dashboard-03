import { useWidgets } from "@/hooks/useWidgets";
import { AlarmData } from "@/types/widget";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";

interface AlarmWidgetProps {
  id: string;
  data?: AlarmData;
  isDetailView: boolean;
}

export default function AlarmWidget({ id, data, isDetailView }: AlarmWidgetProps) {
  const { updateWidget } = useWidgets();
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");

  const alarms = data?.alarms || [];

  const handleSave = () => {
    // Basic validation
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    
    if (hourNum < 0 || hourNum > 23 || minuteNum < 0 || minuteNum > 59) {
      return;
    }

    const newAlarm = {
      id: Date.now().toString(),
      time: new Date().toISOString(), // This will be replaced with actual selected time
      repeat: [],
      sound: "Waves",
      snoozeEnabled: false,
      snoozeInterval: 5,
      isAM: true,
      isPM: false,
      enabled: true,
    };

    updateWidget(id, {
      data: {
        alarms: [...alarms, newAlarm],
      },
    });
    setShowTimeDialog(false);
  };

  if (!isDetailView) {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/50" />
        {alarms.length === 0
          ? "No alarms set"
          : `${alarms.length} alarm${alarms.length === 1 ? "" : "s"} set`}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      {alarms.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <div className="text-muted-foreground">No Alarms</div>
        </div>
      ) : (
        <div className="w-full space-y-2">
          {/* We'll implement the alarm list view later */}
        </div>
      )}

      {/* Add Alarm Button */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90"
          onClick={() => setShowTimeDialog(true)}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Time Selection Dialog */}
      <Dialog open={showTimeDialog} onOpenChange={setShowTimeDialog}>
        <DialogContent className="bg-background/95 backdrop-blur-sm border-none shadow-lg p-6 w-[300px]">
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-center">Select time</h2>
            
            <div className="flex items-center justify-center gap-2">
              <div className="space-y-1">
                <Input
                  type="text"
                  value={hour}
                  onChange={(e) => setHour(e.target.value.padStart(2, '0'))}
                  className="text-4xl text-center w-24 bg-gray-800/50"
                  maxLength={2}
                />
                <div className="text-sm text-center text-muted-foreground">Hour</div>
              </div>
              
              <div className="text-4xl">:</div>
              
              <div className="space-y-1">
                <Input
                  type="text"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value.padStart(2, '0'))}
                  className="text-4xl text-center w-24 bg-gray-800/50"
                  maxLength={2}
                />
                <div className="text-sm text-center text-muted-foreground">Minute</div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowTimeDialog(false)}
                className="text-primary hover:text-primary/90"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="text-primary hover:text-primary/90"
              >
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}