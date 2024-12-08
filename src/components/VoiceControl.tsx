import { useState, useRef } from "react";
import { toast } from "sonner";
import { useWidgets } from "@/hooks/useWidgets";
import { pipeline } from "@huggingface/transformers";
import { processCommand } from "@/utils/commandProcessor";
import RecordButton from "./voice/RecordButton";
import ConfirmationDialog from "./voice/ConfirmationDialog";

export default function VoiceControl() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addWidget, widgets, updateWidget } = useWidgets();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        } 
      });
      
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        try {
          const transcriber = await pipeline(
            "automatic-speech-recognition",
            "onnx-community/whisper-tiny.en",
            { revision: "main" }
          );

          const result = await transcriber(audioUrl);
          
          if (typeof result === 'object' && 'text' in result) {
            setTranscription(result.text.trim().toLowerCase());
          } else if (Array.isArray(result) && result.length > 0 && 'text' in result[0]) {
            setTranscription(result[0].text.trim().toLowerCase());
          }
        } catch (error) {
          console.error("Error processing audio:", error);
          toast.error("Failed to process voice command. Please try again.");
        } finally {
          URL.revokeObjectURL(audioUrl);
          setIsProcessing(false);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Failed to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      toast.success("Processing your command...");
      
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

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

  return (
    <>
      <ConfirmationDialog
        transcription={transcription}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <RecordButton
          isRecording={isRecording}
          isProcessing={isProcessing}
          onClick={isRecording ? stopRecording : startRecording}
        />
      </div>
    </>
  );
}