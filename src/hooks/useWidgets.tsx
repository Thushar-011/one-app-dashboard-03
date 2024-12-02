import { createContext, useContext, useState, ReactNode } from "react";
import { Widget, WidgetType } from "@/types/widget";

/**
 * Context interface defining the shape of our widget management system
 */
interface WidgetsContextType {
  widgets: Widget[];              // Active widgets
  trashedWidgets: Widget[];       // Deleted widgets stored in trash
  editMode: boolean;              // Whether edit mode is active
  toggleEditMode: () => void;     // Toggle edit mode on/off
  addWidget: (type: WidgetType) => void;  // Add new widget
  removeWidget: (id: string) => void;      // Move widget to trash
  updateWidget: (id: string, updates: Partial<Widget>) => void;  // Update widget properties
  restoreWidget: (id: string) => void;     // Restore widget from trash
  clearTrash: () => void;                  // Empty trash
}

const WidgetsContext = createContext<WidgetsContextType | null>(null);

/**
 * Provider component that wraps app to provide widget management functionality
 * Manages state for:
 * - Active widgets
 * - Trashed widgets
 * - Edit mode
 * Provides methods for widget CRUD operations
 */
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
    {
      id: "expense-1",
      type: "expense",
      position: { x: 0, y: 340 },
      size: { width: 150, height: 150 },
      data: { categories: [], expenses: [] },
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

/**
 * Custom hook to access widget context
 * Throws error if used outside WidgetsProvider
 */
export function useWidgets() {
  const context = useContext(WidgetsContext);
  if (!context) {
    throw new Error("useWidgets must be used within a WidgetsProvider");
  }
  return context;
}
