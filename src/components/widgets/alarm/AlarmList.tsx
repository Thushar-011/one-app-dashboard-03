import { AlarmData } from "@/types/widget";

interface AlarmListProps {
  alarms: AlarmData['alarms'];
}

export default function AlarmList({ alarms }: AlarmListProps) {
  if (alarms.length === 0) {
    return (
      <div className="text-muted-foreground text-center mt-4">
        No alarms set
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alarms.map((alarm) => (
        <div 
          key={alarm.id}
          className="p-3 bg-white rounded-lg border border-border/50"
        >
          <div className="text-2xl font-medium">{alarm.time}</div>
        </div>
      ))}
    </div>
  );
}