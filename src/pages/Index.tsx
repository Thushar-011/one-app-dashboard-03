import Layout from "@/components/Layout";
import { Plus } from "lucide-react";
import { useWidgets } from "@/hooks/useWidgets";
import Widget from "@/components/Widget";

export default function Index() {
  const { widgets, editMode, toggleEditMode, addWidget } = useWidgets();

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
            onClick={() => addWidget("alarm")}
            className="bg-secondary text-white p-2 rounded-full shadow-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </Layout>
  );
}