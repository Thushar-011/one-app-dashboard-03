import React, { useState, useEffect } from 'react';
import { Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalogClockProps {
  time: string;
  onTimeChange: (time: string) => void;
  onSwitchMode: () => void;
}

export default function AnalogClock({ time, onTimeChange, onSwitchMode }: AnalogClockProps) {
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Convert time string to hours and minutes
  const getTimeFromString = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours: hours || 0, minutes: minutes || 0 };
  };

  // Convert angle to time
  const getTimeFromAngle = (angle: number) => {
    const hours = Math.floor(((angle + 360) % 360) / 30);
    const minutes = Math.floor((((angle + 360) % 360) % 30) * 2);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Handle pointer drag
  const handleDrag = (event: any, info: any) => {
    const rect = event.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = info.point.x - centerX;
    const y = info.point.y - centerY;
    const newAngle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    setAngle(newAngle);
    
    if (isDragging) {
      onTimeChange(getTimeFromAngle(newAngle));
    }
  };

  // Initialize angle based on current time
  useEffect(() => {
    const { hours, minutes } = getTimeFromString(time);
    const newAngle = (hours * 30) + (minutes / 2);
    setAngle(newAngle);
  }, [time]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative w-48 h-48 mx-auto"
    >
      {/* Clock face */}
      <div className="absolute inset-0 rounded-full bg-gray-50 border-2 border-gray-200 shadow-inner">
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
        <motion.div
          drag
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={handleDrag}
          className="absolute w-1 h-20 bg-primary origin-bottom rounded-full cursor-pointer"
          style={{
            left: '50%',
            bottom: '50%',
            transform: `rotate(${angle}deg)`
          }}
        />

        {/* Center dot */}
        <div className="absolute w-3 h-3 bg-primary rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Mode switch button */}
      <button
        onClick={onSwitchMode}
        className="absolute bottom-2 left-2 p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
      >
        <Keyboard className="w-4 h-4 text-gray-600" />
      </button>
    </motion.div>
  );
}