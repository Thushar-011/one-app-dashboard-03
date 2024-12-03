interface CompactAlarmViewProps {
  alarms: any[];
}

export default function CompactAlarmView({ alarms }: CompactAlarmViewProps) {
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