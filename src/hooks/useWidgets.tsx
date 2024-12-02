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

export function WidgetsProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [trashedWidgets, setTrashedWidgets] = useState<Widget[]>([]);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => setEditMode(!editMode);

  const addWidget = (type: WidgetType, position?: { x: number; y: number }) => {
    const newWidget: Widget = {
      id: `${type}-${Date.now()}`,
      type,
      position: position || { x: 0, y: widgets.length * 170 },
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
      setTrashedWidgets(trashedWidgets.filter(w => w.id !== id));
      
      // Find optimal position for restored widget
      const existingPositions = widgets.map(w => w.position.y);
      let newY = 0;
      
      if (existingPositions.length > 0) {
        const sortedPositions = existingPositions.sort((a, b) => a - b);
        for (let i = 0; i < sortedPositions.length; i++) {
          const currentPos = sortedPositions[i];
          const nextPos = sortedPositions[i + 1];
          
          if (nextPos && nextPos - currentPos >= 170) {
            newY = currentPos + 170;
            break;
          }
        }
        
        if (newY === 0) {
          newY = sortedPositions[sortedPositions.length - 1] + 170;
        }
      }
      
      setWidgets([...widgets, { ...widgetToRestore, position: { x: 0, y: newY } }]);
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