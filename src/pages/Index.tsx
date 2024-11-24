import Layout from "@/components/Layout";
import { Trash2 } from "lucide-react";
import { useWidgets } from "@/hooks/useWidgets";
import Widget from "@/components/Widget";
import TrashList from "@/components/TrashList";
import { useState } from "react";
import WidgetSelector from "@/components/WidgetSelector";

export default function Index() {
  const { widgets, editMode, toggleEditMode } = useWidgets();
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  return (
    <Layout>
      <div className={`relative min-h-[calc(100vh-5rem)] ${editMode ? 'edit-mode' : ''}`}>
        {widgets.map((widget) => (
          <Widget key={widget.id} {...widget} />
        ))}

        <div className="fixed bottom-4 right-4 flex gap-2">
          <button
            onClick={toggleEditMode}
            className="bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
          >
            {editMode ? "Done" : "Edit Widgets"}
          </button>
          
          <button
            onClick={() => setIsTrashOpen(true)}
            className="bg-gray-500 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 transition-colors"
          >
            <Trash2 className="w-6 h-6" />
          </button>
          
          <WidgetSelector />
        </div>

        <TrashList isOpen={isTrashOpen} onClose={() => setIsTrashOpen(false)} />
      </div>
    </Layout>
  );
}