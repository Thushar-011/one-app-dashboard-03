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
      className={`rounded-full w-14 h-14 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center
        ${isRecording 
          ? "bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-300" 
          : "bg-primary hover:bg-primary/90 ring-4 ring-primary/30"
        }
        ${isProcessing ? "animate-spin" : ""}
      `}
      onClick={onClick}
    >
      {isProcessing ? (
        <span className="animate-spin">⏳</span>
      ) : isRecording ? (
        <MicOff className="w-7 h-7 text-white stroke-[1.5]" />
      ) : (
        <Mic className="w-7 h-7 text-white stroke-[1.5]" />
      )}
    </Button>
  );
}