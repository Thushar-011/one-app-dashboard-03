import { useWidgets } from "@/hooks/useWidgets";
import { processCommand } from "@/utils/commandProcessor";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { toast } from "sonner";
import RecordButton from "./voice/RecordButton";
import ConfirmationDialog from "./voice/ConfirmationDialog";

export default function VoiceControl() {
  const { addWidget, widgets, updateWidget } = useWidgets();
  const {
    isRecording,
    isProcessing,
    transcription,
    startRecording,
    stopRecording,
    setTranscription
  } = useVoiceRecorder();

  // Check if any widget is in detail view by looking for the detail view container
  const isWidgetDetailOpen = document.querySelector('.fixed.inset-0.bg-background.overflow-auto') !== null;

  const handleConfirm = async () => {
    if (transcription) {
      try {
        await processCommand(transcription, widgets, updateWidget, addWidget);
        toast.success("Task completed successfully");
      } catch (error) {
        console.error("Error executing command:", error);
        toast.error("Error: Task could not be completed");
      }
      setTranscription(null);
    }
  };

  const handleCancel = () => {
    setTranscription(null);
  };

  // Don't render the voice control if a widget is in detail view
  if (isWidgetDetailOpen) {
    return null;
  }

  return (
    <>
      <ConfirmationDialog
        transcription={transcription}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <RecordButton
          isRecording={isRecording}
          isProcessing={isProcessing}
          onClick={isRecording ? stopRecording : startRecording}
        />
      </div>
    </>
  );
}