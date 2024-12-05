import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, Keyboard } from "lucide-react";

export interface TimeSelectorProps {
  time: Date;
  onChange: (time: Date) => void;
  is12Hour?: boolean;
  isPM?: boolean;
  onPMChange?: (isPM: boolean) => void;
  showKeyboard?: boolean;
  onToggleKeyboard?: () => void;
}

export default function TimeSelector({ 
  time, 
  onChange, 
  is12Hour = false, 
  isPM = false, 
  onPMChange,
  showKeyboard = false,
  onToggleKeyboard
}: TimeSelectorProps) {
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');

  const getHandRotation = () => {
    if (mode === 'hours') {
      let hours = time.getHours();
      if (is12Hour) {
        hours = hours % 12 || 12;
      }
      return (hours * 30) % 360; // 360 / 12 = 30 degrees per hour
    }
    return time.getMinutes() * 6; // 360 / 60 = 6 degrees per minute
  };

  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    let angle = Math.atan2(y, x) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;

    const newTime = new Date(time);
    
    if (mode === 'hours') {
      let hour = Math.round(angle / 30) % 12;
      if (hour === 0) hour = 12;
      
      if (is12Hour) {
        const hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
        newTime.setHours(hour24);
      } else {
        newTime.setHours(hour);
      }
    } else {
      const minute = Math.round(angle / 6) % 60;
      newTime.setMinutes(minute);
    }
    
    onChange(newTime);
  };

  const renderHourNumbers = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1;
      const currentHour = time.getHours() % 12 || 12;
      return (
        <div
          key={hour}
          className={`absolute text-sm font-medium ${
            currentHour === hour ? 'text-primary' : 'text-muted-foreground'
          }`}
          style={{
            left: `${50 + 40 * Math.cos(((hour * 30) - 90) * Math.PI / 180)}%`,
            top: `${50 + 40 * Math.sin(((hour * 30) - 90) * Math.PI / 180)}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {hour}
        </div>
      );
    });
  };

  const renderMinuteNumbers = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const minute = i * 5;
      return (
        <div
          key={i}
          className={`absolute text-sm font-medium ${
            time.getMinutes() === minute ? 'text-primary' : 'text-muted-foreground'
          }`}
          style={{
            left: `${50 + 40 * Math.cos(((i * 30) - 90) * Math.PI / 180)}%`,
            top: `${50 + 40 * Math.sin(((i * 30) - 90) * Math.PI / 180)}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {minute.toString().padStart(2, '0')}
        </div>
      );
    });
  };

  return (
    <div className="relative w-full max-w-sm mx-auto space-y-4">
      {is12Hour && onPMChange && (
        <div className="flex justify-center gap-2">
          <Button
            variant={!isPM ? "default" : "outline"}
            onClick={() => onPMChange(false)}
            className="w-16"
          >
            AM
          </Button>
          <Button
            variant={isPM ? "default" : "outline"}
            onClick={() => onPMChange(true)}
            className="w-16"
          >
            PM
          </Button>
        </div>
      )}

      <div 
        className="relative w-64 h-64 mx-auto bg-background rounded-full border-2 border-primary/20 cursor-pointer"
        onClick={handleClockClick}
      >
        {mode === 'hours' ? renderHourNumbers() : renderMinuteNumbers()}

        <motion.div
          animate={{ rotate: getHandRotation() }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="absolute w-1 bg-primary origin-bottom rounded-full"
          style={{
            height: '40%',
            left: '50%',
            bottom: '50%',
            transformOrigin: 'bottom'
          }}
        />

        <div className="absolute w-3 h-3 bg-primary rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {mode === 'hours' ? 'Select hour' : 'Select minute'}
        </div>
        <div className="flex items-center gap-4">
          {onToggleKeyboard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleKeyboard}
              className="text-primary hover:text-primary/90"
            >
              {showKeyboard ? <Clock className="w-5 h-5" /> : <Keyboard className="w-5 h-5" />}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode(mode === 'hours' ? 'minutes' : 'hours')}
            className="text-primary hover:text-primary border-primary hover:border-primary hover:bg-primary/10 rounded-xl z-10"
          >
            {mode === 'hours' ? 'MIN' : 'HR'}
          </Button>
        </div>
      </div>
    </div>
  );
}