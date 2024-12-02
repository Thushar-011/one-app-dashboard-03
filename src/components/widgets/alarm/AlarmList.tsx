import { useWidgets } from "@/hooks/useWidgets";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Calendar, Bell, Vibrate, Trash2, MoreVertical } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  const { updateWidget, removeWidget } = useWidgets();
  const widgetId = "alarm-1"; // This should match your widget ID

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

  const addLabel = (alarmId: string) => {
    const label = prompt("Enter a label for this alarm:");
    if (label) {
      updateAlarmFeature(alarmId, { label });
      toast({
        title: "Label added",
        description: "The alarm label has been updated.",
      });
    }
  };

  const toggleRepeat = (alarmId: string, day: string) => {
    const alarm = alarms.find((a) => a.id === alarmId);
    const repeat = alarm?.repeat || [];
    const updatedRepeat = repeat.includes(day)
      ? repeat.filter((d) => d !== day)
      : [...repeat, day];
    updateAlarmFeature(alarmId, { repeat: updatedRepeat });
  };

  const toggleVibrate = (alarmId: string) => {
    const alarm = alarms.find((a) => a.id === alarmId);
    updateAlarmFeature(alarmId, { vibrate: !alarm?.vibrate });
    toast({
      title: alarm?.vibrate ? "Vibration disabled" : "Vibration enabled",
      description: `Vibration has been ${alarm?.vibrate ? "disabled" : "enabled"} for this alarm.`,
    });
  };

  const setAlarmSound = (alarmId: string) => {
    const sounds = ["Default", "Gentle", "Nature", "Classic"];
    const currentSound = alarms.find((a) => a.id === alarmId)?.sound || "Default";
    const nextSound = sounds[(sounds.indexOf(currentSound) + 1) % sounds.length];
    updateAlarmFeature(alarmId, { sound: nextSound });
    toast({
      title: "Sound changed",
      description: `Alarm sound has been set to ${nextSound}.`,
    });
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-4">
      {alarms.map((alarm) => (
        <div
          key={alarm.id}
          className="flex items-center justify-between p-4 rounded-lg bg-card border"
        >
          <div className="space-y-1">
            <div className="text-2xl font-semibold">{alarm.time}</div>
            {alarm.label && (
              <div className="text-sm text-muted-foreground">{alarm.label}</div>
            )}
            {alarm.repeat && alarm.repeat.length > 0 && (
              <div className="flex gap-1 text-xs">
                {days.map((day) => (
                  <span
                    key={day}
                    className={`w-6 h-6 flex items-center justify-center rounded-full ${
                      alarm.repeat?.includes(day)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {day[0]}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={alarm.enabled}
              onCheckedChange={(checked) => toggleAlarm(alarm.id, checked)}
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 hover:bg-accent rounded-full">
                <MoreVertical className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => addLabel(alarm.id)}>
                  <span className="mr-2">📝</span> Add label
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => setAlarmSound(alarm.id)}>
                  <Bell className="w-4 h-4 mr-2" />
                  Sound: {alarm.sound || "Default"}
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => toggleVibrate(alarm.id)}>
                  <Vibrate className="w-4 h-4 mr-2" />
                  Vibrate {alarm.vibrate ? "✓" : ""}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem>
                  <Calendar className="w-4 h-4 mr-2" />
                  Repeat
                </DropdownMenuItem>
                <div className="px-2 py-1.5 flex gap-1">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleRepeat(alarm.id, day)}
                      className={`w-6 h-6 text-xs rounded-full ${
                        alarm.repeat?.includes(day)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {day[0]}
                    </button>
                  ))}
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => deleteAlarm(alarm.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}