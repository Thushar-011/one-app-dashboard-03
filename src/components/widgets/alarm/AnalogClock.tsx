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
  const [isDragging, setIsDragging] = useState(false);

  // Generate clock numbers based on mode
  const getNumbers = () => {
    if (mode === 'hour') {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    } else {
      return Array.from({ length: 12 }, (_, i) => i * 5);
    }
  };

  // Convert angle to value with improved accuracy
  const getValueFromAngle = (angle: number) => {
    const normalizedAngle = ((angle + 360) % 360);
    if (mode === 'hour') {
      const hourValue = Math.round(normalizedAngle / 30) || 12;
      return hourValue === 0 ? 12 : hourValue;
    } else {
      return Math.round(normalizedAngle / 6) % 60;
    }
  };

  // Handle pointer drag with improved accuracy
  const handleDrag = (event: any, info: any) => {
    const rect = event.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = info.point.x - centerX;
    const y = info.point.y - centerY;
    const newAngle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    setAngle(newAngle);
    
    if (isDragging) {
      onChange(getValueFromAngle(newAngle));
    }
  };

  // Initialize angle based on current value with improved accuracy
  useEffect(() => {
    let newAngle;
    if (mode === 'hour') {
      newAngle = ((value % 12 || 12) - 3) * 30;
    } else {
      newAngle = (value - 15) * 6;
    }
    setAngle(newAngle);
  }, [value, mode]);

  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        {getNumbers().map((num) => {
          const angle = ((num * (mode === 'hour' ? 30 : 6)) - 90) * (Math.PI / 180);
          const radius = 40; // Percentage from center
          return (
            <div
              key={num}
              className="absolute text-sm font-medium text-gray-300"
              style={{
                left: `${50 + radius * Math.cos(angle)}%`,
                top: `${50 + radius * Math.sin(angle)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {num.toString().padStart(2, '0')}
            </div>
          );
        })}

        <motion.div
          drag
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={handleDrag}
          className="absolute w-1 h-24 bg-primary origin-bottom rounded-full cursor-pointer"
          style={{
            left: '50%',
            bottom: '50%',
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'bottom center'
          }}
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