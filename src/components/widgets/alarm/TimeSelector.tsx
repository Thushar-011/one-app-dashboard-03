import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TimeSelectorProps {
  time: Date;
  onChange: (time: Date) => void;
}

export default function TimeSelector({ time, onChange }: TimeSelectorProps) {
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');
  const [selectedHour, setSelectedHour] = useState(time.getHours());
  const [selectedMinute, setSelectedMinute] = useState(time.getMinutes());

  const getHandRotation = () => {
    if (mode === 'hours') {
      return selectedHour * 15; // 360 / 24 = 15 degrees per hour
    }
    return selectedMinute * 6; // 360 / 60 = 6 degrees per minute
  };

  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    let angle = Math.atan2(y, x) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;

    if (mode === 'hours') {
      const hour = Math.round(angle / 15) % 24;
      setSelectedHour(hour);
      const newTime = new Date(time);
      newTime.setHours(hour);
      newTime.setMinutes(selectedMinute);
      onChange(newTime);
    } else {
      const minute = Math.round(angle / 6) % 60;
      setSelectedMinute(minute);
      const newTime = new Date(time);
      newTime.setHours(selectedHour);
      newTime.setMinutes(minute);
      onChange(newTime);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="text-center mb-4 text-2xl font-light">
        {String(selectedHour).padStart(2, '0')}:{String(selectedMinute).padStart(2, '0')}
      </div>

      <div 
        className="relative w-64 h-64 mx-auto bg-background rounded-full border-2 border-primary/20 cursor-pointer"
        onClick={handleClockClick}
      >
        {mode === 'hours' ? (
          Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className={`absolute text-sm font-medium ${
                selectedHour === i ? 'text-primary' : 'text-muted-foreground'
              }`}
              style={{
                left: `${50 + 40 * Math.cos(((i * 15) - 90) * Math.PI / 180)}%`,
                top: `${50 + 40 * Math.sin(((i * 15) - 90) * Math.PI / 180)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {String(i).padStart(2, '0')}
            </div>
          ))
        ) : (
          Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={`absolute text-sm font-medium ${
                selectedMinute === i * 5 ? 'text-primary' : 'text-muted-foreground'
              }`}
              style={{
                left: `${50 + 40 * Math.cos(((i * 30) - 90) * Math.PI / 180)}%`,
                top: `${50 + 40 * Math.sin(((i * 30) - 90) * Math.PI / 180)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {String(i * 5).padStart(2, '0')}
            </div>
          ))
        )}

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
  );
}