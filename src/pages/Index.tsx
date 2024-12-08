import Layout from "@/components/Layout";
import { Trash2, Pencil } from "lucide-react";
import { useWidgets } from "@/hooks/useWidgets";
import Widget from "@/components/Widget";
import TrashList from "@/components/TrashList";
import SlidePanel from "@/components/SlidePanel";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Index() {
  const { widgets, editMode, toggleEditMode } = useWidgets();
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  return (
    <Layout>
      <div className={`relative min-h-[calc(100vh-5rem)] ${editMode ? 'edit-mode' : ''}`}>
        {widgets.map((widget) => (
          <Widget key={widget.id} {...widget} />
        ))}

        <div className="fixed bottom-4 right-4 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleEditMode}
            className={`text-white p-2 rounded-full shadow-lg transition-colors ${
              editMode 
                ? "bg-secondary hover:bg-secondary/90" 
                : "bg-primary hover:bg-primary/90"
            }`}
            aria-label={editMode ? "Done editing" : "Edit widgets"}
          >
            <Pencil className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsTrashOpen(true)}
            className="trash-button bg-gray-500 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 transition-colors"
          >
            <Trash2 className="w-6 h-6" />
          </motion.button>
        </div>

        <TrashList isOpen={isTrashOpen} onClose={() => setIsTrashOpen(false)} />
        <SlidePanel />
      </div>
    </Layout>
  );
}