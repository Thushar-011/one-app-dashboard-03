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
  restoreAllWidgets: () => void;
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

  const findOptimalPosition = (index: number = widgets.length) => {
    const row = Math.floor(index / MAX_WIDGETS_PER_ROW);
    const col = index % MAX_WIDGETS_PER_ROW;
    
    return {
      x: col * WIDGET_HORIZONTAL_SPACING,
      y: row * WIDGET_VERTICAL_SPACING
    };
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

  const restoreAllWidgets = () => {
    const widgetsToRestore = trashedWidgets.filter(trashedWidget => 
      !widgets.some(w => w.type === trashedWidget.type)
    );

    if (widgetsToRestore.length === 0) {
      return;
    }

    const restoredWidgets = widgetsToRestore.map((widget, index) => ({
      ...widget,
      position: findOptimalPosition(widgets.length + index)
    }));

    setWidgets([...widgets, ...restoredWidgets]);
    setTrashedWidgets(trashedWidgets.filter(w => 
      !widgetsToRestore.some(rw => rw.id === w.id)
    ));
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
        restoreAllWidgets,
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