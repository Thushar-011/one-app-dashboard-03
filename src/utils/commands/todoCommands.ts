import { Widget } from "@/types/widget";
import { toast } from "sonner";

export const handleTodoCommand = (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  const taskText = text.replace(/add (a )?task|todo/i, "").trim();
  if (taskText) {
    let todoWidget = widgets.find(w => w.type === "todo");
    if (!todoWidget) {
      addWidget("todo", { x: 0, y: 0 });
      todoWidget = widgets[widgets.length - 1];
    }

    if (todoWidget) {
      const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
      };

      const updatedTasks = [...(todoWidget?.data?.tasks || []), newTask];
      updateWidget(todoWidget.id, {
        data: { tasks: updatedTasks }
      });

      toast.success("Task added successfully");
    }
  }
};