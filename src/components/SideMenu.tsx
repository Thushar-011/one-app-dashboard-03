import { X } from "lucide-react";
import { useWidgets } from "@/hooks/useWidgets";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const { widgets } = useWidgets();

  // Calculate stats from actual widget data
  const stats = {
    alarm: {
      total: widgets
        .filter(w => w.type === "alarm")
        .reduce((acc, w) => acc + (w.data?.alarms?.length || 0), 0),
      nextIn: (() => {
        const allAlarms = widgets
          .filter(w => w.type === "alarm")
          .flatMap(w => w.data?.alarms || [])
          .filter(a => a.enabled)
          .map(a => a.time);
        
        if (allAlarms.length === 0) return "No alarms";
        
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const nextAlarm = allAlarms
          .sort()
          .find(time => time > currentTime) || allAlarms[0];
          
        return nextAlarm;
      })()
    },
    todo: {
      total: widgets
        .filter(w => w.type === "todo")
        .reduce((acc, w) => acc + (w.data?.tasks?.length || 0), 0),
      completed: widgets
        .filter(w => w.type === "todo")
        .reduce((acc, w) => acc + ((w.data?.tasks || []).filter(t => t.completed)?.length || 0), 0),
      pending: widgets
        .filter(w => w.type === "todo")
        .reduce((acc, w) => acc + ((w.data?.tasks || []).filter(t => !t.completed)?.length || 0), 0)
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity z-50 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 bottom-0 w-80 bg-background dark:bg-background/80 shadow-xl z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Widget Analytics</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Alarms</h3>
            <div className="bg-card dark:bg-card/50 p-3 rounded-lg border border-border">
              <p className="text-foreground">Total Alarms: {stats.alarm.total}</p>
              <p className="text-foreground">Next Alarm: {stats.alarm.nextIn}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-foreground">To-Do List</h3>
            <div className="bg-card dark:bg-card/50 p-3 rounded-lg border border-border">
              <p className="text-foreground">Total Tasks: {stats.todo.total}</p>
              <p className="text-foreground">Completed: {stats.todo.completed}</p>
              <p className="text-foreground">Pending: {stats.todo.pending}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}