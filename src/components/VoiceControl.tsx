import { Mic, MicOff, Check, X } from "lucide-react";
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const { addWidget, widgets, updateWidget } = useWidgets();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

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
        const audioUrl = URL.createObjectURL(audioBlob);
        
        try {
          const transcriber = await pipeline(
            "automatic-speech-recognition",
            "onnx-community/whisper-tiny.en"
          );

          const result = await transcriber(audioUrl, {
            chunk_length_s: 30,
            stride_length_s: 5,
          });

          if (typeof result === 'object' && 'text' in result) {
            setTranscribedText(result.text);
            setShowConfirmation(true);
          } else if (Array.isArray(result) && result.length > 0 && 'text' in result[0]) {
            setTranscribedText(result[0].text);
            setShowConfirmation(true);
          }
        } catch (error) {
          console.error("Error processing audio:", error);
          toast.error("Failed to process voice command");
        } finally {
          URL.revokeObjectURL(audioUrl);
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
      
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleConfirm = async () => {
    try {
      await processCommand(transcribedText, widgets, updateWidget, addWidget);
      toast.success("Command executed successfully");
    } catch (error) {
      console.error("Error executing command:", error);
      toast.error("Failed to execute command");
    } finally {
      setShowConfirmation(false);
      setTranscribedText("");
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setTranscribedText("");
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Button
          size="lg"
          className={`rounded-full w-14 h-14 ${
            isRecording 
              ? "bg-red-500 hover:bg-red-600 shadow-red-500/50" 
              : "bg-primary hover:bg-primary/90 shadow-primary/50"
          } transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? (
            <MicOff className="w-6 h-6 animate-pulse" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Voice Command</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>I heard:</p>
              <p className="text-foreground font-medium bg-muted/50 p-3 rounded-lg">
                "{transcribedText}"
              </p>
              <p>Would you like me to execute this command?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}