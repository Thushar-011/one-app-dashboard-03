import { useWidgets } from "@/hooks/useWidgets";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Clock, Keyboard } from "lucide-react";
import TimeSelector from "./alarm/TimeSelector";
import AlarmList from "./alarm/AlarmList";
import CompactAlarmView from "./alarm/CompactAlarmView";
import AddAlarmButton from "./alarm/AddAlarmButton";
import { toast } from "sonner";

interface AlarmWidgetProps {
  id: string;
  data?: any;
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
      toast.error("Please enter a valid hour (0-23)", {
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
    
    toast.success("Alarm set successfully", {
      duration: 1000,
    });
    
    setShowDialog(false);
    setHour("");
    setMinute("");
    setShowKeyboard(true);
  };

  if (!isDetailView) {
    return <CompactAlarmView alarms={alarms} />;
  }

  return (
    <div className="h-full flex flex-col relative">
      <AlarmList alarms={alarms} widgetId={id} />
      
      <AddAlarmButton onClick={() => {
        setShowDialog(true);
        setShowKeyboard(true);
      }} />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white border-none shadow-lg p-6 max-w-md rounded-2xl">
          <DialogDescription>
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
                />
              )}

              <div className="flex justify-between items-center pt-4 relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className="absolute bottom-0 left-0 p-2 hover:bg-transparent"
                >
                  {showKeyboard ? (
                    <Clock className="w-5 h-5 text-primary hover:text-primary/90" />
                  ) : (
                    <Keyboard className="w-5 h-5 text-primary hover:text-primary/90" />
                  )}
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
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}