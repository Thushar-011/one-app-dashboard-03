import { useWidgets } from "@/hooks/useWidgets";
import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

interface WidgetProps {
  id: string;
  type: "alarm" | "todo";
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export default function Widget({ id, type, position, size }: WidgetProps) {
  const { editMode, updateWidget, removeWidget } = useWidgets();
  const [isDragging, setIsDragging] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);

  const content = {
    alarm: {
      title: "Alarms",
      preview: "2 active alarms",
    },
    todo: {
      title: "To-Do List",
      preview: "3 tasks pending",
    },
  }[type];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeWidget(id);
  };

  return (
    <motion.div
      className="widget absolute"
      style={{
        width: size.width,
        height: size.height,
      }}
      initial={position}
      animate={{
        x: position.x,
        y: position.y,
        scale: isDragging ? 1.05 : 1,
      }}
      drag={editMode}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        updateWidget(id, {
          position: {
            x: position.x + info.offset.x,
            y: position.y + info.offset.y,
          },
        });
      }}
      onClick={() => !editMode && setIsDetailView(!isDetailView)}
      whileHover={{ scale: editMode ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="widget-content">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{content.title}</h3>
          {editMode && (
            <button
              onClick={handleDelete}
              className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600">{content.preview}</p>
      </div>
    </motion.div>
  );
}