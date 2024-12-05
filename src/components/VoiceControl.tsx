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
        
        try {
          const transcriber = await pipeline(
            "automatic-speech-recognition",
            "openai/whisper-tiny.en"
          );

          const result = await transcriber(audioBlob as unknown as ArrayBuffer, {
            chunk_length_s: 30,
            stride_length_s: 5,
          });

          if (typeof result === 'object' && 'text' in result) {
            await processCommand(result.text, widgets, updateWidget, addWidget);
          } else if (Array.isArray(result) && result.length > 0 && 'text' in result[0]) {
            await processCommand(result[0].text, widgets, updateWidget, addWidget);
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