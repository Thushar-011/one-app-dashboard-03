import { createContext, useContext, useState, ReactNode } from "react";
import { Widget, WidgetType } from "@/types/widget";

interface WidgetsContextType {
  widgets: Widget[];
  trashedWidgets: Widget[];
  editMode: boolean;
  toggleEditMode: () => void;
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  restoreWidget: (id: string) => void;
  clearTrash: () => void;
}

const WidgetsContext = createContext<WidgetsContextType | null>(null);

export function WidgetsProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "alarm-1",
      type: "alarm",
      position: { x: 0, y: 0 },
      size: { width: 150, height: 150 },
      data: { alarms: [] },
    },
    {
      id: "todo-1",
      type: "todo",
      position: { x: 0, y: 170 },
      size: { width: 150, height: 150 },
      data: { tasks: [] },
    },
  ]);
  const [trashedWidgets, setTrashedWidgets] = useState<Widget[]>([]);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => setEditMode(!editMode);

  const addWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 0, y: widgets.length * 170 },
      size: { width: 150, height: 150 },
      data: type === "alarm" 
        ? { alarms: [] } 
        : type === "todo" 
        ? { tasks: [] }
        : type === "expense"
        ? { categories: [], expenses: [] }
        : {},
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    const widgetToRemove = widgets.find(w => w.id === id);
    if (widgetToRemove) {
      setWidgets(widgets.filter(w => w.id !== id));
      setTrashedWidgets([...trashedWidgets, widgetToRemove]);
    }
  };

  const restoreWidget = (id: string) => {
    const widgetToRestore = trashedWidgets.find(w => w.id === id);
    if (widgetToRestore) {
      setTrashedWidgets(trashedWidgets.filter(w => w.id !== id));
      setWidgets([...widgets, widgetToRestore]);
    }
  };

  const clearTrash = () => {
    setTrashedWidgets([]);
  };

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setWidgets(
      widgets.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  };

  return (
    <WidgetsContext.Provider
      value={{
        widgets,
        trashedWidgets,
        editMode,
        toggleEditMode,
        addWidget,
        removeWidget,
        updateWidget,
        restoreWidget,
        clearTrash,
      }}
    >
      {children}
    </WidgetsContext.Provider>
  );
}

export function useWidgets() {
  const context = useContext(WidgetsContext);
  if (!context) {
    throw new Error("useWidgets must be used within a WidgetsProvider");
  }
  return context;
}