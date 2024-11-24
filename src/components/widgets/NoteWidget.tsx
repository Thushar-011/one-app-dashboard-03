import { useWidgets } from "@/hooks/useWidgets";
import { NoteData } from "@/types/widget";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Plus, X } from "lucide-react";

interface NoteWidgetProps {
  id: string;
  data?: NoteData;
  isDetailView: boolean;
}

export default function NoteWidget({ id, data, isDetailView }: NoteWidgetProps) {
  const { updateWidget } = useWidgets();
  const [newNoteText, setNewNoteText] = useState("");

  const notes = data?.notes || [];

  const addNote = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!newNoteText.trim()) return;
    
    const newNote = {
      id: Date.now().toString(),
      text: newNoteText.trim(),
      createdAt: new Date().toISOString(),
    };

    updateWidget(id, {
      data: {
        notes: [...notes, newNote],
      },
    });

    setNewNoteText("");
  };

  const removeNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    updateWidget(id, {
      data: {
        notes: notes.filter((note) => note.id !== noteId),
      },
    });
  };

  if (!isDetailView) {
    return (
      <div className="text-sm text-gray-600 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/50" />
        {notes.length === 0
          ? "No notes"
          : `${notes.length} note${notes.length === 1 ? "" : "s"}`}
      </div>
    );
  }

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col gap-2">
        <Textarea
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="Write a new note..."
          className="min-h-[100px]"
        />
        <Button onClick={(e) => addNote(e)} className="self-end">
          Add Note
        </Button>
      </div>

      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex items-start justify-between bg-gray-50 p-3 rounded"
          >
            <div className="flex-1">
              <p className="whitespace-pre-wrap">{note.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={(e) => removeNote(e, note.id)}
              className="p-1 hover:bg-gray-200 rounded ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}