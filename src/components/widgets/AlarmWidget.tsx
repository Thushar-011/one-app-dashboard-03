import { useWidgets } from "@/hooks/useWidgets";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { Clock, Keyboard } from "lucide-react";
import TimeSelector from "./alarm/TimeSelector";
import AlarmList from "./alarm/AlarmList";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 transform">
        <Button
          variant="outline"
          onClick={() => {
            setShowDialog(true);
            setShowKeyboard(true);
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/90 to-primary hover:from-primary hover:to-primary/90 border-none shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <span className="text-white text-3xl font-light select-none">+</span>
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white border-none shadow-lg p-6 max-w-md rounded-2xl">
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-center">Set alarm time</h2>
            
            <AnimatePresence mode="wait">
              {showKeyboard ? (
                <motion.div
                  key="keyboard"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center gap-2"
                >
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
                </motion.div>
              ) : (
                <motion.div
                  key="clock"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TimeSelector
                    time={new Date()}
                    onChange={(date) => {
                      setHour(date.getHours().toString().padStart(2, '0'));
                      setMinute(date.getMinutes().toString().padStart(2, '0'));
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

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
        </DialogContent>
      </Dialog>
    </div>
  );
}