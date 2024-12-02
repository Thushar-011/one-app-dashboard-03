import { useWidgets } from "@/hooks/useWidgets";
import { AlarmData } from "@/types/widget";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { Clock, Keyboard } from "lucide-react";
import TimeSelector from "./alarm/TimeSelector";
import AlarmList from "./alarm/AlarmList";
import AddAlarmButton from "./alarm/AddAlarmButton";

interface AlarmWidgetProps {
  id: string;
  data?: AlarmData;
  isDetailView: boolean;
}

export default function AlarmWidget({ id, data, isDetailView }: AlarmWidgetProps) {
  const { updateWidget } = useWidgets();
  const [showDialog, setShowDialog] = useState(false);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);

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
      enabled: true,
    };

    updateWidget(id, {
      data: {
        alarms: [...alarms, newAlarm],
      },
    });
    setShowDialog(false);
    setHour("");
    setMinute("");
    setShowKeyboard(false);
  };

  if (!isDetailView) {
    return (
      <div className="h-full flex flex-col relative pb-16">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary/50" />
          {alarms.length === 0
            ? "No alarms set"
            : `${alarms.length} alarm${alarms.length === 1 ? "" : "s"} set`}
        </div>
        
        <AddAlarmButton onClick={() => setShowDialog(true)} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative pb-16">
      <AlarmList alarms={alarms} />
      <AddAlarmButton onClick={() => setShowDialog(true)} />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white border-none shadow-lg p-6 max-w-md">
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-center">Set alarm time</h2>
            
            {showKeyboard ? (
              <div className="flex items-center justify-center gap-2">
                <div className="space-y-1">
                  <Input
                    type="text"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    placeholder="00"
                    className="text-4xl text-center w-24"
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
                    className="text-4xl text-center w-24"
                    maxLength={2}
                  />
                  <div className="text-sm text-center text-muted-foreground">Minute</div>
                </div>
              </div>
            ) : (
              <TimeSelector
                time={new Date()}
                onChange={(date) => {
                  setHour(date.getHours().toString().padStart(2, '0'));
                  setMinute(date.getMinutes().toString().padStart(2, '0'));
                }}
                showKeyboard={showKeyboard}
                onToggleKeyboard={() => setShowKeyboard(!showKeyboard)}
              />
            )}

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  setHour("");
                  setMinute("");
                  setShowKeyboard(false);
                }}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              {!showKeyboard && (
                <Button
                  variant="ghost"
                  onClick={() => setShowKeyboard(true)}
                  className="absolute bottom-6 left-6 hover:bg-gray-100"
                >
                  <Keyboard className="w-5 h-5" />
                </Button>
              )}
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-white"
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