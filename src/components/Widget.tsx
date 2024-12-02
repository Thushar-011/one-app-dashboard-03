import { useWidgets } from "@/hooks/useWidgets";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlarmClock, ListTodo, Calendar, FileText, ArrowLeft } from "lucide-react";
import { Widget as WidgetType } from "@/types/widget";
import AlarmWidget from "./widgets/AlarmWidget";
import TodoWidget from "./widgets/TodoWidget";
import NoteWidget from "./widgets/NoteWidget";
import ReminderWidget from "./widgets/ReminderWidget";
import { Button } from "./ui/button";

export default function Widget({ id, type, position, size, data }: WidgetType) {
  const { editMode, updateWidget, removeWidget } = useWidgets();
  const [isDragging, setIsDragging] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeWidget(id);
  };

  const getWidgetIcon = () => {
    switch (type) {
      case "alarm":
        return <AlarmClock className="w-5 h-5" />;
      case "todo":
        return <ListTodo className="w-5 h-5" />;
      case "reminder":
        return <Calendar className="w-5 h-5" />;
      case "note":
        return <FileText className="w-5 h-5" />;
    }
  };

  const getWidgetTitle = () => {
    switch (type) {
      case "alarm":
        return "Alarm";
      case "todo":
        return "To-Do List";
      case "reminder":
        return "Reminders";
      case "note":
        return "Notes";
      default:
        return type;
    }
  };

  const renderWidgetContent = () => {
    switch (type) {
      case "alarm":
        return <AlarmWidget id={id} data={data} isDetailView={isDetailView} />;
      case "todo":
        return <TodoWidget id={id} data={data} isDetailView={isDetailView} />;
      case "note":
        return <NoteWidget id={id} data={data} isDetailView={isDetailView} />;
      case "reminder":
        return <ReminderWidget id={id} data={data} isDetailView={isDetailView} />;
      default:
        return <div>Widget type not implemented yet</div>;
    }
  };

  return (
    <>
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
        {/* Widget content */}
        <div className="widget-content">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getWidgetIcon()}
              <h3 className="font-semibold">{getWidgetTitle()}</h3>
            </div>
            {editMode && (
              <button
                onClick={handleDelete}
                className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
          {renderWidgetContent()}
        </div>
      </motion.div>

      {/* Detail View Modal */}
      <AnimatePresence>
        {isDetailView && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 bg-background overflow-auto"
            >
              <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b p-4 mb-4">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsDetailView(false)}
                      className="shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                      {getWidgetIcon()}
                      <h2 className="text-xl font-semibold">{getWidgetTitle()}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-2xl mx-auto p-4">
                {renderWidgetContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
