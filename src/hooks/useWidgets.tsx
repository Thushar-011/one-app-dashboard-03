import { createContext, useContext, useState, ReactNode } from "react";
import { Widget, WidgetType } from "@/types/widget";

interface WidgetsContextType {
  widgets: Widget[];
  trashedWidgets: Widget[];
  editMode: boolean;
  toggleEditMode: () => void;
  addWidget: (type: WidgetType, position?: { x: number; y: number }) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  restoreWidget: (id: string) => void;
  clearTrash: () => void;
}

const WidgetsContext = createContext<WidgetsContextType | null>(null);

const WIDGET_VERTICAL_SPACING = 170;
const WIDGET_HORIZONTAL_SPACING = 170;
const MAX_WIDGETS_PER_ROW = 2;

export function WidgetsProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [trashedWidgets, setTrashedWidgets] = useState<Widget[]>([]);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => setEditMode(!editMode);

  const findOptimalPosition = () => {
    const positions = widgets.map(w => ({
      x: w.position.x,
      y: w.position.y
    }));

    let row = 0;
    let col = 0;
    let position = { x: 0, y: 0 };

    while (true) {
      position = {
        x: col * WIDGET_HORIZONTAL_SPACING,
        y: row * WIDGET_VERTICAL_SPACING
      };

      const isPositionTaken = positions.some(
        p => p.x === position.x && p.y === position.y
      );

      if (!isPositionTaken) break;

      col++;
      if (col >= MAX_WIDGETS_PER_ROW) {
        col = 0;
        row++;
      }
    }

    return position;
  };

  const addWidget = (type: WidgetType, position?: { x: number; y: number }) => {
    const newWidget: Widget = {
      id: `${type}-${Date.now()}`,
      type,
      position: position || findOptimalPosition(),
      size: { width: 150, height: 150 },
      data: type === "alarm" 
        ? { alarms: [] } 
        : type === "todo" 
        ? { tasks: [] }
        : type === "reminder"
        ? { reminders: [] }
        : type === "note"
        ? { notes: [] }
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
      const newPosition = findOptimalPosition();
      setTrashedWidgets(trashedWidgets.filter(w => w.id !== id));
      setWidgets([...widgets, { ...widgetToRestore, position: newPosition }]);
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