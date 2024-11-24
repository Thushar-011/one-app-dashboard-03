import { useWidgets } from "@/hooks/useWidgets";
import { TodoData } from "@/types/widget";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Plus, X } from "lucide-react";

interface TodoWidgetProps {
  id: string;
  data?: TodoData;
  isDetailView: boolean;
}

export default function TodoWidget({ id, data, isDetailView }: TodoWidgetProps) {
  const { updateWidget } = useWidgets();
  const [newTask, setNewTask] = useState("");

  const tasks = data?.tasks || [];

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const newTaskItem = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
    };

    updateWidget(id, {
      data: {
        tasks: [...tasks, newTaskItem],
      },
    });

    setNewTask("");
  };

  const removeTask = (taskId: string) => {
    updateWidget(id, {
      data: {
        tasks: tasks.filter((task) => task.id !== taskId),
      },
    });
  };

  const toggleTask = (taskId: string) => {
    updateWidget(id, {
      data: {
        tasks: tasks.map((task) =>
          task.id === taskId
            ? { ...task, completed: !task.completed }
            : task
        ),
      },
    });
  };

  if (!isDetailView) {
    const pendingTasks = tasks.filter((task) => !task.completed).length;
    return (
      <div className="text-sm text-gray-600">
        {pendingTasks === 0
          ? "No pending tasks"
          : `${pendingTasks} task${pendingTasks === 1 ? "" : "s"} pending`}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <Button onClick={addTask} size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-gray-50 p-2 rounded"
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`flex-1 text-left ${
                task.completed && "text-gray-400 line-through"
              }`}
            >
              {task.text}
            </button>
            <button
              onClick={() => removeTask(task.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}