import { Widget } from "@/types/widget";
import { toast } from "sonner";

export const handleNoteCommand = (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  const noteText = text.replace(/start taking notes|add (a )?note/i, "").trim();
  if (noteText) {
    let noteWidget = widgets.find(w => w.type === "note");
    if (!noteWidget) {
      addWidget("note", { x: 0, y: 0 });
      noteWidget = widgets[widgets.length - 1];
    }

    if (noteWidget) {
      const newNote = {
        id: Date.now().toString(),
        text: noteText,
        createdAt: new Date().toISOString(),
      };

      const updatedNotes = [...(noteWidget?.data?.notes || []), newNote];
      updateWidget(noteWidget.id, {
        data: { notes: updatedNotes }
      });

      toast.success("Note added successfully");
    }
  }
};