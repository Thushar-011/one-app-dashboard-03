import { createContext, useContext, useState, ReactNode } from "react";

interface Widget {
  id: string;
  type: "alarm" | "todo";
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WidgetsContextType {
  widgets: Widget[];
  editMode: boolean;
  toggleEditMode: () => void;
  addWidget: (type: Widget["type"]) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
}

const WidgetsContext = createContext<WidgetsContextType | null>(null);

export function WidgetsProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "alarm-1",
      type: "alarm",
      position: { x: 0, y: 0 },
      size: { width: 150, height: 150 },
    },
    {
      id: "todo-1",
      type: "todo",
      position: { x: 0, y: 170 },
      size: { width: 150, height: 150 },
    },
  ]);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => setEditMode(!editMode);

  const addWidget = (type: Widget["type"]) => {
    const newWidget: Widget = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 0, y: 0 },
      size: { width: 150, height: 150 },
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
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
        editMode,
        toggleEditMode,
        addWidget,
        removeWidget,
        updateWidget,
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