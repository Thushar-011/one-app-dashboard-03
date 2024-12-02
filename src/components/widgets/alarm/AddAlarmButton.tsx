import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddAlarmButtonProps {
  onClick: () => void;
}

export default function AddAlarmButton({ onClick }: AddAlarmButtonProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex justify-center">
      <Button
        size="icon"
        className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
        onClick={onClick}
      >
        <Plus className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
}