import { Trash2, AlarmClock, ListTodo, Calendar, FileText, IndianRupee } from "lucide-react";
import { WidgetType } from "@/types/widget";

interface WidgetHeaderProps {
  type: WidgetType;
  editMode: boolean;
  onDelete: (e: React.MouseEvent) => void;
}

export default function WidgetHeader({ type, editMode, onDelete }: WidgetHeaderProps) {
  const getWidgetIcon = () => {
    switch (type) {
      case "alarm":
        return <AlarmClock className="w-5 h-5" />;
      case "todo":
        return <ListTodo className="w-5 h-5" />;
      case "reminder":
        return <Calendar className="w-5 h-5" />;
      case "note":
        return <FileText className="w-5 h-5" />;
      case "expense":
        return <IndianRupee className="w-5 h-5" />;
    }
  };

  const getWidgetTitle = () => {
    switch (type) {
      case "alarm":
        return "Alarm";
      case "todo":
        return "To-Do List";
      case "reminder":
        return "Reminders";
      case "note":
        return "Notes";
      case "expense":
        return "Expense Tracker";
      default:
        return type;
    }
  };

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {getWidgetIcon()}
        <h3 className="font-semibold">{getWidgetTitle()}</h3>
      </div>
      {editMode && (
        <div className="flex items-center gap-2">
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}