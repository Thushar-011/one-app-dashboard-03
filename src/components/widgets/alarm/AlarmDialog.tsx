import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ClockPicker from "./ClockPicker";

interface AlarmDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onSave: (hour: string, minute: string, isPM: boolean) => void;
}

export default function AlarmDialog({ showDialog, setShowDialog, onSave }: AlarmDialogProps) {
  const [time, setTime] = useState({ hour: 12, minute: 0 });
  const [mode, setMode] = useState<'hour' | 'minute'>('hour');
  const [isPM, setIsPM] = useState(false);

  const handleSave = () => {
    // No conversion needed here - we'll pass the raw hour value
    onSave(
      String(time.hour),
      String(time.minute).padStart(2, '0'),
      isPM
    );
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="bg-white border-none shadow-lg p-6 max-w-md rounded-2xl">
        <DialogTitle className="text-lg font-medium text-center mb-4">Set alarm time</DialogTitle>
        
        <div className="space-y-6">
          <ClockPicker
            value={time}
            onChange={setTime}
            mode={mode}
            onModeChange={setMode}
          />

          <div className="flex justify-center gap-2">
            <Button
              variant={!isPM ? "default" : "outline"}
              onClick={() => setIsPM(false)}
              className="w-16"
            >
              AM
            </Button>
            <Button
              variant={isPM ? "default" : "outline"}
              onClick={() => setIsPM(true)}
              className="w-16"
            >
              PM
            </Button>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSave();
                setShowDialog(false);
              }}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl"
            >
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}