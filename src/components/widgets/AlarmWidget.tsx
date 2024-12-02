import { useWidgets } from "@/hooks/useWidgets";
import { AlarmData } from "@/types/widget";
import { Plus, Keyboard, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import AnalogClock from "./alarm/AnalogClock";

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
  const [useClockInterface, setUseClockInterface] = useState(false);
  const [clockMode, setClockMode] = useState<'hour' | 'minute'>('hour');

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
    setUseClockInterface(false);
    setClockMode('hour');
  };

  const handleClockHourChange = (value: number) => {
    setHour(value.toString());
  };

  const handleClockMinuteChange = (value: number) => {
    setMinute(value.toString());
  };

  if (!isDetailView) {
    return (
      <div className="text-sm text-muted-foreground flex flex-col items-center justify-between h-full relative">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/50" />
          {alarms.length === 0
            ? "No alarms set"
            : `${alarms.length} alarm${alarms.length === 1 ? "" : "s"} set`}
        </div>
        
        <Button
          size="icon"
          className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 absolute bottom-0 left-1/2 -translate-x-1/2"
          onClick={() => setShowDialog(true)}
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
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
          className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
          onClick={() => setShowDialog(true)}
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Time Selection Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-none shadow-lg p-6 max-w-md">
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-center text-gray-200">Set alarm time</h2>
            
            {useClockInterface ? (
              <>
                <div className="text-center text-3xl font-medium text-gray-200 mb-4">
                  {hour.padStart(2, '0')}:{minute.padStart(2, '0')}
                </div>
                <AnalogClock
                  mode={clockMode}
                  value={clockMode === 'hour' ? parseInt(hour || '0') : parseInt(minute || '0')}
                  onChange={clockMode === 'hour' ? handleClockHourChange : handleClockMinuteChange}
                  onSwitchMode={() => setUseClockInterface(false)}
                />
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    className={`px-6 ${clockMode === 'hour' ? 'bg-primary text-white' : 'text-gray-300'}`}
                    onClick={() => setClockMode('hour')}
                  >
                    Hour
                  </Button>
                  <Button
                    variant="outline"
                    className={`px-6 ${clockMode === 'minute' ? 'bg-primary text-white' : 'text-gray-300'}`}
                    onClick={() => setClockMode('minute')}
                  >
                    Minute
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <div className="space-y-1">
                  <Input
                    type="text"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    placeholder="00"
                    className="text-4xl text-center w-24 bg-gray-800/50 border-gray-700 text-gray-200"
                    maxLength={2}
                  />
                  <div className="text-sm text-center text-gray-400">Hour</div>
                </div>
                
                <div className="text-4xl text-gray-200">:</div>
                
                <div className="space-y-1">
                  <Input
                    type="text"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    placeholder="00"
                    className="text-4xl text-center w-24 bg-gray-800/50 border-gray-700 text-gray-200"
                    maxLength={2}
                  />
                  <div className="text-sm text-center text-gray-400">Minute</div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDialog(false);
                  setHour("");
                  setMinute("");
                  setUseClockInterface(false);
                  setClockMode('hour');
                }}
                className="text-gray-300 hover:text-white hover:bg-gray-800/50"
              >
                Cancel
              </Button>
              {!useClockInterface && (
                <Button
                  variant="ghost"
                  onClick={() => setUseClockInterface(true)}
                  className="absolute bottom-6 left-6 text-gray-300 hover:text-white hover:bg-gray-800/50"
                >
                  <Clock className="w-5 h-5" />
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