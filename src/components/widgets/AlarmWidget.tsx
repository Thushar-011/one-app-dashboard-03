import { useWidgets } from "@/hooks/useWidgets";
import { AlarmData } from "@/types/widget";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { Clock } from "lucide-react";
import TimeSelector from "./alarm/TimeSelector";
import AlarmList from "./alarm/AlarmList";

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
  const [showKeyboard, setShowKeyboard] = useState(true);

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
    setShowKeyboard(true);
  };

  if (!isDetailView) {
    return (
      <div className="h-full flex flex-col relative">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary/50" />
          {alarms.length === 0
            ? "No alarms set"
            : `${alarms.length} alarm${alarms.length === 1 ? "" : "s"} set`}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      <AlarmList alarms={alarms} />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-primary hover:bg-primary/90"
          onClick={() => {
            setShowDialog(true);
            setShowKeyboard(true);
          }}
        >
          <span className="text-white text-xl">+</span>
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white border-none shadow-lg p-6 max-w-md rounded-2xl">
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
                    className="text-4xl text-center w-24 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
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
                    className="text-4xl text-center w-24 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
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

            <div className="flex justify-between items-center pt-4 relative">
              <Button
                variant="ghost"
                onClick={() => setShowKeyboard(false)}
                className="absolute bottom-0 left-0 hover:bg-gray-100 p-2"
              >
                <Clock className="w-5 h-5 text-primary" />
              </Button>
              
              <div className="flex gap-4 ml-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDialog(false);
                    setHour("");
                    setMinute("");
                    setShowKeyboard(true);
                  }}
                  className="hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl"
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}