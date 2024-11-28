import { X } from "lucide-react";
import { useWidgets } from "@/hooks/useWidgets";
import { formatIndianCurrency } from "@/lib/utils";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const { widgets } = useWidgets();

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
    },
    expense: {
      total: widgets
        .filter(w => w.type === "expense")
        .reduce((acc, w) => acc + (w.data?.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0), 0),
      categories: widgets
        .filter(w => w.type === "expense")
        .reduce((acc, w) => acc + (w.data?.categories?.length || 0), 0)
    },
    note: {
      total: widgets
        .filter(w => w.type === "note")
        .reduce((acc, w) => acc + (w.data?.notes?.length || 0), 0)
    },
    reminder: {
      total: widgets
        .filter(w => w.type === "reminder")
        .reduce((acc, w) => acc + (w.data?.reminders?.length || 0), 0),
      active: widgets
        .filter(w => w.type === "reminder")
        .reduce((acc, w) => acc + ((w.data?.reminders || []).filter(r => !r.completed)?.length || 0), 0)
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
        className={`fixed top-0 left-0 bottom-0 w-80 bg-background shadow-xl z-50 transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Widget Analytics</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Alarms</h3>
            <div className="bg-card p-3 rounded-lg border">
              <p>Total Alarms: {stats.alarm.total}</p>
              <p>Next Alarm: {stats.alarm.nextIn}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">To-Do List</h3>
            <div className="bg-card p-3 rounded-lg border">
              <p>Total Tasks: {stats.todo.total}</p>
              <p>Completed: {stats.todo.completed}</p>
              <p>Pending: {stats.todo.pending}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Expenses</h3>
            <div className="bg-card p-3 rounded-lg border">
              <p>Total Spent: {formatIndianCurrency(stats.expense.total)}</p>
              <p>Categories: {stats.expense.categories}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Notes</h3>
            <div className="bg-card p-3 rounded-lg border">
              <p>Total Notes: {stats.note.total}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Reminders</h3>
            <div className="bg-card p-3 rounded-lg border">
              <p>Total Reminders: {stats.reminder.total}</p>
              <p>Active Reminders: {stats.reminder.active}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}