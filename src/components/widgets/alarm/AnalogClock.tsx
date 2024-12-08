import React, { useState, useEffect } from 'react';
import { Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalogClockProps {
  mode: 'hour' | 'minute';
  value: number;
  onChange: (value: number) => void;
  onSwitchMode: () => void;
}

export default function AnalogClock({ mode, value, onChange, onSwitchMode }: AnalogClockProps) {
  const [angle, setAngle] = useState(0);

  const getNumbers = () => {
    if (mode === 'hour') {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    } else {
      return Array.from({ length: 12 }, (_, i) => i * 5);
    }
  };

  const getValueFromPosition = (x: number, y: number, rect: DOMRect) => {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate angle in radians, adjusted to start from 12 o'clock
    const angleRad = Math.atan2(y - centerY, x - centerX);
    // Convert to degrees and normalize to 0-360 range, with 0 at 12 o'clock
    let angleDeg = ((angleRad * 180 / Math.PI) + 90 + 360) % 360;
    
    if (mode === 'hour') {
      // Convert angle to hour (1-12)
      const hour = Math.round(angleDeg / 30);
      return hour === 0 ? 12 : hour;
    } else {
      // Convert angle to minutes (0-55, step 5)
      const minute = Math.round(angleDeg / 6);
      return minute % 60;
    }
  };

  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newValue = getValueFromPosition(x, y, rect);
    onChange(newValue);
    
    // Calculate angle for hand position
    const angleRad = Math.atan2(y - rect.height / 2, x - rect.width / 2);
    let newAngle = ((angleRad * 180 / Math.PI) + 90 + 360) % 360;
    setAngle(newAngle);
  };

  useEffect(() => {
    // Update angle when value changes
    let newAngle;
    if (mode === 'hour') {
      // For hours, each number represents 30 degrees (360/12)
      newAngle = ((value % 12 || 12) - 3) * 30;
    } else {
      // For minutes, each mark represents 6 degrees (360/60)
      newAngle = (value - 15) * 6;
    }
    setAngle(newAngle);
  }, [value, mode]);

  return (
    <div className="relative w-64 h-64 mx-auto">
      <div 
        className="absolute inset-0 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 cursor-pointer"
        onClick={handleClockClick}
      >
        {getNumbers().map((num) => {
          const angle = ((num * (mode === 'hour' ? 30 : 6)) - 90) * (Math.PI / 180);
          const radius = 40;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          
          return (
            <div
              key={num}
              className={`absolute text-sm font-medium ${
                (mode === 'hour' ? value : Math.floor(value / 5) * 5) === num
                  ? 'text-primary'
                  : 'text-gray-300'
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {num.toString().padStart(2, '0')}
            </div>
          );
        })}

        <motion.div
          className="absolute w-1 h-24 bg-primary origin-bottom rounded-full"
          style={{
            left: '50%',
            bottom: '50%',
            transformOrigin: 'bottom center'
          }}
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        <div className="absolute w-3 h-3 bg-primary rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <button
        onClick={onSwitchMode}
        className="absolute bottom-4 left-4 p-2 rounded-full hover:bg-gray-700/50 transition-colors"
      >
        <Keyboard className="w-5 h-5 text-gray-300" />
      </button>
    </div>
  );
}