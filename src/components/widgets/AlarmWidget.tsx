import { useWidgets } from "@/hooks/useWidgets";
import { AlarmData } from "@/types/widget";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

interface AlarmWidgetProps {
  id: string;
  data?: AlarmData;
  isDetailView: boolean;
}

export default function AlarmWidget({ id, data, isDetailView }: AlarmWidgetProps) {
  const { updateWidget } = useWidgets();
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  const alarms = data?.alarms || [];

  const validateTime = (hour: string, minute: string) => {
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    
    if (isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
      toast({
        title: "Invalid hour",
        description: "Please enter a number between 0 and 23",
        variant: "destructive",
      });
      return false;
    }
    
    if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
      toast({
        title: "Invalid minute",
        description: "Please enter a number between 0 and 59",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSave = () => {
    if (!validateTime(hour, minute)) return;

    const newAlarm = {
      id: Date.now().toString(),
      time: `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`,
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
    setHour("");
    setMinute("");
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
    <div className="h-full flex flex-col relative pb-8">
      {/* Alarms List */}
      <div className="flex-1">
        {alarms.length === 0 ? (
          <div className="text-muted-foreground text-center mt-4">No Alarms</div>
        ) : (
          <div className="space-y-2">
            {alarms.map((alarm) => (
              <div 
                key={alarm.id}
                className="p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50"
              >
                <div className="text-2xl font-medium">{alarm.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Alarm Button */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <Button
          size="icon"
          className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-lg"
          onClick={() => setShowTimeDialog(true)}
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Time Selection Dialog */}
      <Dialog open={showTimeDialog} onOpenChange={setShowTimeDialog}>
        <DialogContent className="bg-background/95 backdrop-blur-sm border-none shadow-lg p-6 w-[300px]">
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-center">Set alarm time</h2>
            
            <div className="flex items-center justify-center gap-2">
              <div className="space-y-1">
                <Input
                  type="text"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  placeholder="00"
                  className="text-4xl text-center w-24 bg-background/50"
                  maxLength={2}
                />
                <div className="text-sm text-center text-muted-foreground">Hour</div>
              </div>
              
              <div className="text-4xl">:</div>
              
              <div className="space-y-1">
                <Input
                  type="text"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  placeholder="00"
                  className="text-4xl text-center w-24 bg-background/50"
                  maxLength={2}
                />
                <div className="text-sm text-center text-muted-foreground">Minute</div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowTimeDialog(false);
                  setHour("");
                  setMinute("");
                }}
                className="hover:bg-background/80"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90"
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