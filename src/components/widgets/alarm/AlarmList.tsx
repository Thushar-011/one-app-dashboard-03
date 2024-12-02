import { useWidgets } from "@/hooks/useWidgets";
import { Switch } from "@/components/ui/switch";
import { Bell, Vibrate, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface AlarmListProps {
  alarms: Array<{
    id: string;
    time: string;
    enabled: boolean;
    label?: string;
    repeat?: string[];
    sound?: string;
    vibrate?: boolean;
  }>;
}

export default function AlarmList({ alarms }: AlarmListProps) {
  const { updateWidget } = useWidgets();
  const widgetId = "alarm-1";

  const toggleAlarm = (alarmId: string, enabled: boolean) => {
    const updatedAlarms = alarms.map((alarm) =>
      alarm.id === alarmId ? { ...alarm, enabled } : alarm
    );
    updateWidget(widgetId, { data: { alarms: updatedAlarms } });
  };

  const updateAlarmFeature = (alarmId: string, updates: Partial<AlarmListProps["alarms"][0]>) => {
    const updatedAlarms = alarms.map((alarm) =>
      alarm.id === alarmId ? { ...alarm, ...updates } : alarm
    );
    updateWidget(widgetId, { data: { alarms: updatedAlarms } });
  };

  const deleteAlarm = (alarmId: string) => {
    const updatedAlarms = alarms.filter((alarm) => alarm.id !== alarmId);
    updateWidget(widgetId, { data: { alarms: updatedAlarms } });
    toast({
      title: "Alarm deleted",
      description: "The alarm has been removed successfully.",
    });
  };

  const days = [
    { key: "Mon", label: "Monday" },
    { key: "Tue", label: "Tuesday" },
    { key: "Wed", label: "Wednesday" },
    { key: "Thu", label: "Thursday" },
    { key: "Fri", label: "Friday" },
    { key: "Sat", label: "Saturday" },
    { key: "Sun", label: "Sunday" },
  ];

  return (
    <div className="space-y-4">
      {alarms.map((alarm) => (
        <Accordion
          key={alarm.id}
          type="single"
          collapsible
          className="bg-white rounded-lg border shadow-sm"
        >
          <AccordionItem value="item-1" className="border-none">
            <div className="flex items-center justify-between p-4">
              <AccordionTrigger className="hover:no-underline flex-1">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-display">{alarm.time}</span>
                  {alarm.label && (
                    <span className="text-sm text-muted-foreground">
                      {alarm.label}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <Switch
                checked={alarm.enabled}
                onCheckedChange={(checked) => toggleAlarm(alarm.id, checked)}
                className="ml-4"
              />
            </div>

            <AccordionContent className="px-4 pb-4">
              <div className="space-y-6">
                {/* Label */}
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Add label"
                    value={alarm.label || ""}
                    onChange={(e) =>
                      updateAlarmFeature(alarm.id, { label: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Sound */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Sound
                  </div>
                  <button
                    onClick={() =>
                      updateAlarmFeature(alarm.id, {
                        sound:
                          alarm.sound === "Default"
                            ? "Gentle"
                            : alarm.sound === "Gentle"
                            ? "Nature"
                            : "Default",
                      })
                    }
                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Bell className="w-4 h-4 text-primary" />
                    <span>{alarm.sound || "Default"}</span>
                  </button>
                </div>

                {/* Vibration */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Vibration
                  </div>
                  <button
                    onClick={() =>
                      updateAlarmFeature(alarm.id, { vibrate: !alarm.vibrate })
                    }
                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Vibrate className="w-4 h-4 text-primary" />
                    <span>{alarm.vibrate ? "On" : "Off"}</span>
                  </button>
                </div>

                {/* Repeat */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground pointer-events-none">
                    Repeat
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {days.map((day) => (
                      <button
                        key={day.key}
                        onClick={() => {
                          const repeat = alarm.repeat || [];
                          const updatedRepeat = repeat.includes(day.key)
                            ? repeat.filter((d) => d !== day.key)
                            : [...repeat, day.key];
                          updateAlarmFeature(alarm.id, { repeat: updatedRepeat });
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                          alarm.repeat?.includes(day.key)
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "text-muted-foreground hover:bg-gray-100"
                        )}
                      >
                        {day.key}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete alarm</span>
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}