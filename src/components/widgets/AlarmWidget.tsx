import { useWidgets } from "@/hooks/useWidgets";
import { AlarmData } from "@/types/widget";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Plus, X, Clock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AnalogClock from "./alarm/AnalogClock";

interface AlarmWidgetProps {
  id: string;
  data?: AlarmData;
  isDetailView: boolean;
}

export default function AlarmWidget({ id, data, isDetailView }: AlarmWidgetProps) {
  const { updateWidget } = useWidgets();
  const [newAlarmTime, setNewAlarmTime] = useState("");
  const [isAnalogMode, setIsAnalogMode] = useState(false);

  const alarms = data?.alarms || [];

  const addAlarm = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!newAlarmTime) return;
    
    const newAlarm = {
      id: Date.now().toString(),
      time: newAlarmTime,
      enabled: true,
    };

    updateWidget(id, {
      data: {
        alarms: [...alarms, newAlarm],
      },
    });

    setNewAlarmTime("");
  };

  const removeAlarm = (e: React.MouseEvent, alarmId: string) => {
    e.stopPropagation();
    updateWidget(id, {
      data: {
        alarms: alarms.filter((alarm) => alarm.id !== alarmId),
      },
    });
  };

  const toggleAlarm = (e: React.MouseEvent, alarmId: string) => {
    e.stopPropagation();
    updateWidget(id, {
      data: {
        alarms: alarms.map((alarm) =>
          alarm.id === alarmId
            ? { ...alarm, enabled: !alarm.enabled }
            : alarm
        ),
      },
    });
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
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      <AnimatePresence mode="wait">
        {isAnalogMode ? (
          <motion.div
            key="analog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <AnalogClock
              time={newAlarmTime}
              onTimeChange={setNewAlarmTime}
              onSwitchMode={() => setIsAnalogMode(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="digital"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex gap-2"
          >
            <Input
              type="time"
              value={newAlarmTime}
              onChange={(e) => setNewAlarmTime(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && addAlarm(e)}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsAnalogMode(true)}
            >
              <Clock className="w-4 h-4" />
            </Button>
            <Button onClick={(e) => addAlarm(e)} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className="widget-list-item flex items-center justify-between p-2 rounded"
          >
            <button
              onClick={(e) => toggleAlarm(e, alarm.id)}
              className={`flex-1 text-left ${
                !alarm.enabled && "text-muted-foreground line-through"
              }`}
            >
              {alarm.time}
            </button>
            <button
              onClick={(e) => removeAlarm(e, alarm.id)}
              className="p-1 hover:bg-white/5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}