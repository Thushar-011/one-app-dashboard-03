import { X } from "lucide-react";
import { useWidgets } from "@/hooks/useWidgets";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const { widgets } = useWidgets();

  const stats = {
    alarm: { total: 3, nextIn: "2h 30m" },
    todo: { total: 5, completed: 2, pending: 3 },
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
        className={`fixed top-0 left-0 bottom-0 w-80 bg-white shadow-xl z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Widget Analytics</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Alarms</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p>Total Alarms: {stats.alarm.total}</p>
              <p>Next Alarm: {stats.alarm.nextIn}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">To-Do List</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p>Total Tasks: {stats.todo.total}</p>
              <p>Completed: {stats.todo.completed}</p>
              <p>Pending: {stats.todo.pending}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}