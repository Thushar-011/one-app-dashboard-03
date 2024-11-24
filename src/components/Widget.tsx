import { useWidgets } from "@/hooks/useWidgets";
import { useState } from "react";
import { motion } from "framer-motion";

interface WidgetProps {
  id: string;
  type: "alarm" | "todo";
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export default function Widget({ id, type, position, size }: WidgetProps) {
  const { editMode, updateWidget } = useWidgets();
  const [isDragging, setIsDragging] = useState(false);

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
    >
      <div className="widget-content">
        <h3 className="font-semibold mb-2">{content.title}</h3>
        <p className="text-sm text-gray-600">{content.preview}</p>
      </div>
    </motion.div>
  );
}