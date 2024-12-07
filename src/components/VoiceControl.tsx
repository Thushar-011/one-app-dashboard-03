import { Mic, MicOff } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { useWidgets } from "@/hooks/useWidgets";
import { pipeline } from "@huggingface/transformers";
import { toast } from "sonner";
import { processCommand } from "@/utils/commandProcessor";

export default function VoiceControl() {
  const [isRecording, setIsRecording] = useState(false);
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
          console.log("Initializing speech recognition pipeline...");
          const transcriber = await pipeline(
            "automatic-speech-recognition",
            "openai/whisper-tiny.en"
          );

          console.log("Processing audio...");
          const result = await transcriber(audioUrl, {
            chunk_length_s: 30,
            stride_length_s: 5,
          });

          console.log("Transcription result:", result);

          if (result && typeof result === 'object' && 'text' in result) {
            const text = result.text.trim();
            console.log("Processing command:", text);
            await processCommand(text, widgets, updateWidget, addWidget);
          } else {
            console.error("Invalid transcription result:", result);
            toast.error("Could not understand audio");
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
      toast.success("Started recording");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      toast.success("Stopped recording");
      
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