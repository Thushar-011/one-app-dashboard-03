import { useWidgets } from "@/hooks/useWidgets";
import { TodoData } from "@/types/widget";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface TodoWidgetProps {
  id: string;
  data?: TodoData;
  isDetailView: boolean;
}

export default function TodoWidget({ id, data, isDetailView }: TodoWidgetProps) {
  const { updateWidget } = useWidgets();
  const [newTask, setNewTask] = useState("");

  const tasks = data?.tasks || [];

  const addTask = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
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

  const removeTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
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
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/50" />
        {pendingTasks === 0
          ? "No pending tasks"
          : `${pendingTasks} task${pendingTasks === 1 ? "" : "s"} pending`}
      </div>
    );
  }

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      <TooltipProvider>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && addTask(e)}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={(e) => addTask(e)} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add new task</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-card p-2 rounded border"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <label
                    htmlFor={task.id}
                    className={`flex-1 text-sm ${
                      task.completed && "text-muted-foreground"
                    }`}
                  >
                    {task.text}
                  </label>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => removeTask(e, task.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove task</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </ScrollArea>
      </TooltipProvider>
    </div>
  );
}