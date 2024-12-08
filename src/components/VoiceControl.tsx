import { useWidgets } from "@/hooks/useWidgets";
import { processCommand } from "@/utils/commandProcessor";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { toast } from "sonner";
import RecordButton from "./voice/RecordButton";
import ConfirmationDialog from "./voice/ConfirmationDialog";
import { useEffect, useState } from "react";

export default function VoiceControl() {
  const { addWidget, widgets, updateWidget } = useWidgets();
  const [isVisible, setIsVisible] = useState(true);
  const {
    isRecording,
    isProcessing,
    transcription,
    startRecording,
    stopRecording,
    setTranscription
  } = useVoiceRecorder();

  useEffect(() => {
    // Check if any widget is in detail view
    const checkWidgetDetailView = () => {
      const detailView = document.querySelector('.fixed.inset-0.bg-background.overflow-auto');
      setIsVisible(!detailView);
    };

    // Initial check
    checkWidgetDetailView();

    // Create an observer to watch for DOM changes
    const observer = new MutationObserver(checkWidgetDetailView);

    // Start observing the document body for DOM changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);

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

  if (!isVisible) {
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