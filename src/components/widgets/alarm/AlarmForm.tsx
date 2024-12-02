import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alarm } from "@/types/widget";
import { Keyboard } from "lucide-react";
import TimeSelector from "./TimeSelector";
import { motion, AnimatePresence } from "framer-motion";

interface AlarmFormProps {
  onSave: (alarm: Alarm) => void;
  onCancel: () => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SOUNDS = ["Waves", "Chimes", "Bell", "Digital", "Soft Rise"];
const SNOOZE_INTERVALS = [5, 10, 15];

export default function AlarmForm({ onSave, onCancel }: AlarmFormProps) {
  const [time, setTime] = useState(new Date());
  const [isAM, setIsAM] = useState(true);
  const [isPM, setIsPM] = useState(false);
  const [repeat, setRepeat] = useState<string[]>([]);
  const [sound, setSound] = useState("Waves");
  const [snoozeEnabled, setSnoozeEnabled] = useState(false);
  const [snoozeInterval, setSnoozeInterval] = useState(5);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleSave = () => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: time.toISOString(),
      repeat,
      sound,
      snoozeEnabled,
      snoozeInterval,
      isAM,
      isPM,
      enabled: true,
    };
    onSave(newAlarm);
  };

  const toggleDay = (day: string) => {
    setRepeat((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <TimeSelector
          time={time}
          onChange={setTime}
          showKeyboard={showKeyboard}
          onToggleKeyboard={() => setShowKeyboard(!showKeyboard)}
        />
      </div>

      <div className="flex gap-2 justify-center">
        <Button
          variant={isAM ? "default" : "outline"}
          size="sm"
          onClick={() => setIsAM(!isAM)}
        >
          AM
        </Button>
        <Button
          variant={isPM ? "default" : "outline"}
          size="sm"
          onClick={() => setIsPM(!isPM)}
        >
          PM
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Repeat</label>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day) => (
              <Button
                key={day}
                variant={repeat.includes(day) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleDay(day)}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Sound</label>
          <div className="grid grid-cols-2 gap-2">
            {SOUNDS.map((s) => (
              <Button
                key={s}
                variant={sound === s ? "default" : "outline"}
                size="sm"
                onClick={() => setSound(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Snooze</div>
            <div className="text-sm text-muted-foreground">
              {snoozeEnabled ? `${snoozeInterval} minutes` : "Disabled"}
            </div>
          </div>
          <Switch
            checked={snoozeEnabled}
            onCheckedChange={setSnoozeEnabled}
          />
        </div>

        {snoozeEnabled && (
          <div className="flex gap-2">
            {SNOOZE_INTERVALS.map((interval) => (
              <Button
                key={interval}
                variant={snoozeInterval === interval ? "default" : "outline"}
                size="sm"
                onClick={() => setSnoozeInterval(interval)}
              >
                {interval}m
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>OK</Button>
      </div>
    </div>
  );
}