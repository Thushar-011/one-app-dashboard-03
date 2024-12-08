import { Mic, MicOff } from "lucide-react";
import { Button } from "../ui/button";

interface RecordButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

export default function RecordButton({ isRecording, isProcessing, onClick }: RecordButtonProps) {
  return (
    <Button
      size="lg"
      disabled={isProcessing}
      className={`rounded-full w-14 h-14 p-0 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl z-40
        ${isRecording 
          ? "bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-300" 
          : "bg-primary hover:bg-primary/90 ring-4 ring-primary/30"
        }
        ${isProcessing ? "animate-spin" : ""}
      `}
      onClick={onClick}
      aria-label={isRecording ? "Stop Recording" : "Start Recording"}
    >
      {isProcessing ? (
        <span className="animate-spin">⏳</span>
      ) : isRecording ? (
        <MicOff className="w-6 h-6 text-white" />
      ) : (
        <Mic className="w-6 h-6 text-white" />
      )}
    </Button>
  );
}