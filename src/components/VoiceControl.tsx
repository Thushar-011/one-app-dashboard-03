import { Mic, MicOff } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { useWidgets } from "@/hooks/useWidgets";
import { pipeline } from "@huggingface/transformers";
import { toast } from "sonner";

export default function VoiceControl() {
  const [isRecording, setIsRecording] = useState(false);
  const { addWidget, widgets } = useWidgets();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const processCommand = async (text: string) => {
    const lowerText = text.toLowerCase();
    console.log("Processing command:", lowerText);

    // Alarm commands
    if (lowerText.includes("alarm")) {
      const timeMatch = lowerText.match(/(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const period = timeMatch[3]?.toLowerCase();

        // Convert to 24-hour format
        if (period === "pm" && hours < 12) hours += 12;
        if (period === "am" && hours === 12) hours = 0;

        const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        
        // Find existing alarm widget or create new one
        let alarmWidget = widgets.find(w => w.type === "alarm");
        if (!alarmWidget) {
          addWidget("alarm");
          alarmWidget = widgets[widgets.length - 1];
        }

        const newAlarm = {
          id: Date.now().toString(),
          time,
          enabled: true,
        };

        const updatedAlarms = [...(alarmWidget?.data?.alarms || []), newAlarm];
        addWidget("alarm", {
          data: { alarms: updatedAlarms }
        });

        toast.success(`Alarm set for ${time}`);
      }
    }

    // Todo commands
    else if (lowerText.includes("task") || lowerText.includes("todo")) {
      const taskText = text.replace(/add (a )?task|todo/i, "").trim();
      if (taskText) {
        let todoWidget = widgets.find(w => w.type === "todo");
        if (!todoWidget) {
          addWidget("todo");
          todoWidget = widgets[widgets.length - 1];
        }

        const newTask = {
          id: Date.now().toString(),
          text: taskText,
          completed: false,
        };

        const updatedTasks = [...(todoWidget?.data?.tasks || []), newTask];
        addWidget("todo", {
          data: { tasks: updatedTasks }
        });

        toast.success("Task added successfully");
      }
    }

    // Reminder commands
    else if (lowerText.includes("reminder")) {
      const reminderText = text.replace(/set (a )?reminder/i, "").trim();
      if (reminderText) {
        let reminderWidget = widgets.find(w => w.type === "reminder");
        if (!reminderWidget) {
          addWidget("reminder");
          reminderWidget = widgets[widgets.length - 1];
        }

        const newReminder = {
          id: Date.now().toString(),
          text: reminderText,
          date: new Date().toISOString(),
          completed: false,
        };

        const updatedReminders = [...(reminderWidget?.data?.reminders || []), newReminder];
        addWidget("reminder", {
          data: { reminders: updatedReminders }
        });

        toast.success("Reminder added successfully");
      }
    }

    // Note commands
    else if (lowerText.includes("note")) {
      const noteText = text.replace(/start taking notes|add (a )?note/i, "").trim();
      if (noteText) {
        let noteWidget = widgets.find(w => w.type === "note");
        if (!noteWidget) {
          addWidget("note");
          noteWidget = widgets[widgets.length - 1];
        }

        const newNote = {
          id: Date.now().toString(),
          text: noteText,
          createdAt: new Date().toISOString(),
        };

        const updatedNotes = [...(noteWidget?.data?.notes || []), newNote];
        addWidget("note", {
          data: { notes: updatedNotes }
        });

        toast.success("Note added successfully");
      }
    }

    // Expense commands
    else if (lowerText.includes("expense")) {
      const match = lowerText.match(/expense of (\d+) under (.+)/i);
      if (match) {
        const amount = parseInt(match[1]);
        const category = match[2].trim();

        let expenseWidget = widgets.find(w => w.type === "expense");
        if (!expenseWidget) {
          addWidget("expense");
          expenseWidget = widgets[widgets.length - 1];
        }

        // Create category if it doesn't exist
        let categoryId = expenseWidget?.data?.categories?.find(
          (c: any) => c.name.toLowerCase() === category.toLowerCase()
        )?.id;

        if (!categoryId) {
          categoryId = Date.now().toString();
          const newCategory = {
            id: categoryId,
            name: category,
            color: "#" + Math.floor(Math.random()*16777215).toString(16),
          };
          expenseWidget.data.categories = [...(expenseWidget?.data?.categories || []), newCategory];
        }

        const newExpense = {
          id: Date.now().toString(),
          amount,
          description: `Voice command: ${amount} under ${category}`,
          categoryId,
          date: new Date().toISOString(),
        };

        const updatedExpenses = [...(expenseWidget?.data?.expenses || []), newExpense];
        addWidget("expense", {
          data: {
            categories: expenseWidget.data.categories,
            expenses: updatedExpenses,
          }
        });

        toast.success(`Expense of ${amount} added under ${category}`);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        
        try {
          // Initialize Whisper model for speech recognition
          const transcriber = await pipeline(
            "automatic-speech-recognition",
            "openai/whisper-tiny.en"
          );

          // Convert audio to text
          const result = await transcriber(audioBlob);
          console.log("Transcription result:", result);

          if (result.text) {
            await processCommand(result.text);
          }
        } catch (error) {
          console.error("Error processing audio:", error);
          toast.error("Failed to process voice command");
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      
      // Stop all tracks in the stream
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <Button
        size="lg"
        className={`rounded-full w-14 h-14 ${
          isRecording ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
        } transition-all duration-200 shadow-lg hover:shadow-xl`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? (
          <MicOff className="w-6 h-6 animate-pulse" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
}