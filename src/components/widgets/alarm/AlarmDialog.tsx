import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AlarmDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onSave: (hour: string, minute: string, isPM: boolean) => void;
}

export default function AlarmDialog({ showDialog, setShowDialog, onSave }: AlarmDialogProps) {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [isPM, setIsPM] = useState(false);

  const resetAndClose = () => {
    setShowDialog(false);
    setHour("");
    setMinute("");
    setIsPM(false);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="bg-white border-none shadow-lg p-6 max-w-md rounded-2xl">
        <DialogTitle className="text-lg font-medium text-center">Set alarm time</DialogTitle>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="space-y-1">
              <Input
                type="text"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                placeholder="12"
                className="text-4xl text-center w-24 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                maxLength={2}
              />
              <div className="text-sm text-center text-muted-foreground">Hour</div>
            </div>
            
            <div className="text-4xl">:</div>
            
            <div className="space-y-1">
              <Input
                type="text"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                placeholder="00"
                className="text-4xl text-center w-24 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                maxLength={2}
              />
              <div className="text-sm text-center text-muted-foreground">Minute</div>
            </div>
          </div>

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
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outline"
            onClick={resetAndClose}
            className="hover:bg-gray-100 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(hour, minute, isPM);
              resetAndClose();
            }}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}