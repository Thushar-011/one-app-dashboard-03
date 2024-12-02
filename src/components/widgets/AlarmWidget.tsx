import { useWidgets } from "@/hooks/useWidgets";
import { AlarmData, Alarm } from "@/types/widget";
import { Button } from "../ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import AlarmForm from "./alarm/AlarmForm";
import { formatTime } from "@/lib/utils";

interface AlarmWidgetProps {
  id: string;
  data?: AlarmData;
  isDetailView: boolean;
}

export default function AlarmWidget({ id, data, isDetailView }: AlarmWidgetProps) {
  const { updateWidget } = useWidgets();
  const [showForm, setShowForm] = useState(false);

  const alarms = data?.alarms || [];

  const handleSaveAlarm = (alarm: Alarm) => {
    updateWidget(id, {
      data: {
        alarms: [...alarms, alarm],
      },
    });
    setShowForm(false);
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
      {showForm ? (
        <AlarmForm onSave={handleSaveAlarm} onCancel={() => setShowForm(false)} />
      ) : (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Alarm
            </Button>
          </div>
          <div className="space-y-2">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="widget-list-item flex items-center justify-between p-3 rounded"
              >
                <div>
                  <div className="font-medium">{formatTime(alarm.time)}</div>
                  <div className="text-sm text-muted-foreground">
                    {alarm.repeat.length > 0
                      ? alarm.repeat.join(", ")
                      : "Never repeats"}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {alarm.sound}
                  {alarm.snoozeEnabled && " · Snooze"}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}