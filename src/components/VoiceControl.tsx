import { Mic, MicOff } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { useWidgets } from "@/hooks/useWidgets";
import { pipeline } from "@huggingface/transformers";
import { toast } from "sonner";
import { processCommand } from "@/utils/commandProcessor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
          console.log("Initializing transcriber...");
          const transcriber = await pipeline(
            "automatic-speech-recognition",
            "onnx-community/whisper-tiny.en",
            {
              revision: "main"
            }
          );

          console.log("Starting transcription...");
          const result = await transcriber(audioUrl);
          console.log("Transcription result:", result);

          if (typeof result === 'object' && 'text' in result) {
            const cleanedText = result.text.trim().toLowerCase();
            console.log("Cleaned transcription:", cleanedText);
            setTranscription(cleanedText);
          } else if (Array.isArray(result) && result.length > 0 && 'text' in result[0]) {
            const cleanedText = result[0].text.trim().toLowerCase();
            console.log("Cleaned transcription:", cleanedText);
            setTranscription(cleanedText);
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
        console.log("Executing command:", transcription);
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
      <AlertDialog open={transcription !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Voice Command</AlertDialogTitle>
            <AlertDialogDescription>
              Did you mean: &quot;{transcription}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <Button
          size="lg"
          disabled={isProcessing}
          className={`rounded-full w-14 h-14 transition-all duration-300 shadow-lg hover:shadow-xl 
            ${isRecording 
              ? "bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-300" 
              : "bg-primary hover:bg-primary/90 ring-4 ring-primary/30"
            }
            ${isProcessing ? "animate-spin" : ""}
          `}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isProcessing ? (
            <span className="animate-spin">⏳</span>
          ) : isRecording ? (
            <MicOff className="w-6 h-6 text-white animate-bounce" />
          ) : (
            <Mic className="w-6 h-6 text-white transition-transform hover:scale-110" />
          )}
        </Button>
      </div>
    </>
  );
}
