import React from 'react';
import { motion } from 'framer-motion';

interface ClockPickerProps {
  value: { hour: number; minute: number };
  onChange: (value: { hour: number; minute: number }) => void;
  mode: 'hour' | 'minute';
  onModeChange: (mode: 'hour' | 'minute') => void;
}

export default function ClockPicker({ value, onChange, mode, onModeChange }: ClockPickerProps) {
  const numbers = mode === 'hour' 
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 12 }, (_, i) => i * 5);

  const minuteMarkers = Array.from({ length: 60 }, (_, i) => i);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    // Calculate angle from center, with 0 degrees at 12 o'clock
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    
    if (mode === 'hour') {
      let hour = Math.round(angle / 30);
      if (hour === 0) hour = 12;
      onChange({ ...value, hour: hour });
    } else {
      const minute = Math.round(angle / 6) % 60;
      onChange({ ...value, minute: minute });
    }
  };

  const getHandRotation = () => {
    if (mode === 'hour') {
      const hour = value.hour % 12 || 12;
      // Convert hour to angle, with 12 o'clock being 0 degrees
      return (hour * 30) - 90;
    }
    // Convert minutes to angle, with 12 o'clock being 0 degrees
    return (value.minute * 6) - 90;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4 text-2xl font-semibold">
        <button
          onClick={() => onModeChange('hour')}
          className={`${mode === 'hour' ? 'text-primary' : 'text-gray-400'} hover:text-primary transition-colors`}
        >
          {String(value.hour).padStart(2, '0')}
        </button>
        <span>:</span>
        <button
          onClick={() => onModeChange('minute')}
          className={`${mode === 'minute' ? 'text-primary' : 'text-gray-400'} hover:text-primary transition-colors`}
        >
          {String(value.minute).padStart(2, '0')}
        </button>
      </div>

      <div 
        className="relative w-64 h-64 rounded-full border-2 border-gray-200 cursor-pointer"
        onClick={handleClick}
      >
        {/* Minute markers */}
        {mode === 'minute' && minuteMarkers.map((marker) => {
          const angle = (marker * 6 - 90) * (Math.PI / 180);
          const isMainMarker = marker % 5 === 0;
          const radius = isMainMarker ? 48 : 46;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          
          return (
            <div
              key={marker}
              className={`absolute rounded-full ${
                isMainMarker ? 'w-1 h-1 bg-gray-400' : 'w-0.5 h-0.5 bg-gray-300'
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}

        {/* Hour/Minute numbers */}
        {numbers.map((number) => {
          const angle = ((number * (mode === 'hour' ? 30 : 6)) - 90) * (Math.PI / 180);
          const radius = 40;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          
          const isSelected = mode === 'hour' 
            ? value.hour === number
            : value.minute === number;

          return (
            <div
              key={number}
              className={`absolute text-sm font-medium transition-all ${
                isSelected ? 'text-primary scale-125' : 'text-gray-600'
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {number}
            </div>
          );
        })}

        {/* Clock hand */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[2px] bg-primary"
          style={{
            height: '40%',
            transformOrigin: '50% 0%',
          }}
          animate={{
            rotate: getHandRotation(),
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        />

        {/* Center dot */}
        <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}