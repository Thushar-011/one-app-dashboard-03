import { useWidgets } from "@/hooks/useWidgets";
import { Switch } from "@/components/ui/switch";
import { Bell, Vibrate, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  widgetId: string;
}

const formatTime = (time24: string) => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export default function AlarmList({ alarms, widgetId }: AlarmListProps) {
  const { updateWidget } = useWidgets();

  const toggleAlarm = (alarmId: string, enabled: boolean) => {
    const updatedAlarms = alarms.map((alarm) =>
      alarm.id === alarmId ? { ...alarm, enabled } : alarm
    );
    updateWidget(widgetId, { data: { alarms: updatedAlarms } });
    toast.success(enabled ? "Alarm enabled" : "Alarm disabled", {
      duration: 1000,
    });
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
    toast.success("Alarm deleted", {
      duration: 1000,
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
    <div className="space-y-3">
      {alarms.map((alarm) => (
        <Accordion
          key={alarm.id}
          type="single"
          collapsible
          className="bg-white rounded-lg border shadow-sm"
        >
          <AccordionItem value="item-1" className="border-none">
            <div className="flex items-center justify-between p-3">
              <AccordionTrigger className="hover:no-underline flex-1 py-0">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-display">{formatTime(alarm.time)}</span>
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

            <AccordionContent className="px-3 pb-3">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <input
                    type="text"
                    placeholder="Add label"
                    value={alarm.label || ""}
                    onChange={(e) =>
                      updateAlarmFeature(alarm.id, { label: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50/50 border-2 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      updateAlarmFeature(alarm.id, {
                        sound: alarm.sound === "Default" ? "Gentle" : "Default",
                      })
                    }
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                  >
                    <Bell className="w-4 h-4 text-primary" />
                    <span>{alarm.sound || "Default"}</span>
                  </button>

                  <button
                    onClick={() =>
                      updateAlarmFeature(alarm.id, { vibrate: !alarm.vibrate })
                    }
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                  >
                    <Vibrate className="w-4 h-4 text-primary" />
                    <span>{alarm.vibrate ? "On" : "Off"}</span>
                  </button>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2 pointer-events-none select-none">
                    Repeat
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
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
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                          alarm.repeat?.includes(day.key)
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {day.key}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-sm"
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