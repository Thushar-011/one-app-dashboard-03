import { useState, useRef } from "react";
import { toast } from "sonner";
import { pipeline } from "@huggingface/transformers";

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
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

  return {
    isRecording,
    isProcessing,
    transcription,
    startRecording,
    stopRecording,
    setTranscription
  };
};