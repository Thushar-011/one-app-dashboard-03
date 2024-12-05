import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Keyboard } from "lucide-react";
import TimeSelector from "./TimeSelector";
import { motion, AnimatePresence } from "framer-motion";

interface AlarmDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onSave: (hour: string, minute: string, isPM: boolean) => void;
}

export default function AlarmDialog({ showDialog, setShowDialog, onSave }: AlarmDialogProps) {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isPM, setIsPM] = useState(false);

  const handleTimeChange = (date: Date) => {
    let hours = date.getHours();
    const isPM = hours >= 12;
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    setHour(hours.toString());
    setMinute(date.getMinutes().toString().padStart(2, '0'));
    setIsPM(isPM);
  };

  const resetAndClose = () => {
    setShowDialog(false);
    setHour("");
    setMinute("");
    setShowKeyboard(false);
    setIsPM(false);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="bg-white border-none shadow-lg p-6 max-w-md rounded-2xl">
        <DialogTitle className="text-lg font-medium text-center">Set alarm time</DialogTitle>
        
        <AnimatePresence mode="wait">
          {showKeyboard ? (
            <motion.div
              key="keyboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
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
            </motion.div>
          ) : (
            <motion.div
              key="clock"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <TimeSelector
                time={new Date()}
                onChange={handleTimeChange}
                is12Hour={true}
                isPM={isPM}
                onPMChange={setIsPM}
                showKeyboard={showKeyboard}
                onToggleKeyboard={() => setShowKeyboard(!showKeyboard)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center pt-4 relative">
          <Button
            variant="ghost"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="absolute bottom-0 left-0 p-2 hover:bg-transparent"
          >
            {showKeyboard ? (
              <Clock className="w-5 h-5 text-primary hover:text-primary/90" />
            ) : (
              <Keyboard className="w-5 h-5 text-primary hover:text-primary/90" />
            )}
          </Button>
          
          <div className="flex gap-4 ml-auto">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}