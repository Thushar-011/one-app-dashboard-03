import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeSelectorProps {
  time: Date;
  onChange: (time: Date) => void;
  showKeyboard: boolean;
  onToggleKeyboard: () => void;
}

export default function TimeSelector({ time, onChange, showKeyboard, onToggleKeyboard }: TimeSelectorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [angle, setAngle] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [showMinutes, setShowMinutes] = useState(false);

  useEffect(() => {
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    setAngle(hours * 30 + minutes / 2);
    setSelectedMinute(minutes);
  }, [time]);

  const handleClockDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - centerX;
    const y = clientY - centerY;
    const newAngle = Math.atan2(y, x) * 180 / Math.PI + 90;

    setAngle(newAngle);

    const hours = Math.round(((newAngle + 360) % 360) / 30) % 12;
    const newTime = new Date(time);
    newTime.setHours(hours);
    onChange(newTime);
  };

  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
    const newTime = new Date(time);
    newTime.setMinutes(minute);
    onChange(newTime);
    setShowMinutes(false);
  };

  const handleKeyboardInput = (value: string) => {
    const [hours, minutes] = value.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;
    
    const newTime = new Date(time);
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    onChange(newTime);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showKeyboard ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4"
          >
            <Input
              type="time"
              className="text-2xl text-center"
              onChange={(e) => handleKeyboardInput(e.target.value)}
              value={`${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-48 h-48 mx-auto"
          >
            {/* Clock face */}
            <div
              className="absolute inset-0 rounded-full bg-gray-50 border-2 border-gray-200 shadow-inner"
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseMove={handleClockDrag}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              onTouchMove={handleClockDrag}
            >
              {/* Hour numbers */}
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="absolute font-medium text-gray-600"
                  style={{
                    left: `${50 + 40 * Math.cos(((i + 1) * 30 - 90) * Math.PI / 180)}%`,
                    top: `${50 + 40 * Math.sin(((i + 1) * 30 - 90) * Math.PI / 180)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {i + 1}
                </div>
              ))}

              {/* Clock hand */}
              <div
                className="absolute w-1 h-20 bg-primary origin-bottom rounded-full"
                style={{
                  left: '50%',
                  bottom: '50%',
                  transform: `rotate(${angle}deg)`
                }}
              />

              {/* Center dot */}
              <div className="absolute w-3 h-3 bg-primary rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Minutes */}
            <div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-lg font-medium cursor-pointer"
              onClick={() => setShowMinutes(true)}
            >
              {selectedMinute.toString().padStart(2, '0')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minute picker */}
      <AnimatePresence>
        {showMinutes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 bg-white rounded-lg shadow-lg overflow-auto max-h-48"
          >
            <div className="grid grid-cols-4 gap-2 p-4">
              {Array.from({ length: 60 }, (_, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMinuteSelect(i)}
                >
                  {i.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute bottom-2 left-2"
        onClick={onToggleKeyboard}
      >
        <Keyboard className="w-4 h-4" />
      </Button>
    </div>
  );
}