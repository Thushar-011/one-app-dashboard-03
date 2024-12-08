import React from 'react';
import { Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalogClockProps {
  mode: 'hour' | 'minute';
  value: number;
  onChange: (value: number) => void;
  onSwitchMode: () => void;
}

export default function AnalogClock({ mode, value, onChange, onSwitchMode }: AnalogClockProps) {
  const getNumbers = () => {
    if (mode === 'hour') {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    } else {
      return Array.from({ length: 12 }, (_, i) => i * 5);
    }
  };

  const getHandRotation = () => {
    if (mode === 'hour') {
      return (value * 30) - 90; // 360° / 12 = 30° per hour, -90° to start at 12 o'clock
    } else {
      return (value * 6) - 90; // 360° / 60 = 6° per minute, -90° to start at 12 o'clock
    }
  };

  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    let angle = Math.atan2(y, x) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;

    if (mode === 'hour') {
      let hour = Math.round(angle / 30);
      if (hour === 0 || hour > 12) hour = 12;
      onChange(hour);
    } else {
      let minute = Math.round(angle / 6);
      if (minute === 60) minute = 0;
      minute = Math.round(minute / 5) * 5;
      onChange(minute);
    }
  };

  return (
    <div className="relative w-64 h-64 mx-auto">
      <div 
        className="absolute inset-0 rounded-full bg-white border-4 border-primary/20 cursor-pointer shadow-inner"
        onClick={handleClockClick}
      >
        {/* Clock face with numbers */}
        {getNumbers().map((num) => {
          const angle = ((num * (mode === 'hour' ? 30 : 6)) - 90) * (Math.PI / 180);
          const radius = 44; // Adjusted for perfect boundary alignment
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          
          const isSelected = mode === 'hour' ? 
            value === num : 
            value === num;

          return (
            <div
              key={num}
              className={`absolute text-base font-semibold transition-colors ${
                isSelected ? 'text-primary scale-125' : 'text-gray-600'
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {num.toString().padStart(2, '0')}
            </div>
          );
        })}

        {/* Clock center dot */}
        <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-20" />

        {/* Clock hands */}
        <motion.div
          className="absolute left-1/2 top-1/2 origin-center z-10"
          style={{
            width: '2px',
            height: mode === 'hour' ? '30%' : '40%',
            backgroundColor: 'rgb(139, 92, 246)', // primary color
            transformOrigin: '50% 100%',
            rotate: getHandRotation(),
          }}
        />

        {/* Minute markers */}
        {mode === 'minute' && Array.from({ length: 60 }).map((_, i) => {
          if (i % 5 === 0) return null; // Skip positions where numbers are
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const outerRadius = 46;
          const innerRadius = 44;
          const x1 = 50 + outerRadius * Math.cos(angle);
          const y1 = 50 + outerRadius * Math.sin(angle);
          const x2 = 50 + innerRadius * Math.cos(angle);
          const y2 = 50 + innerRadius * Math.sin(angle);
          
          return (
            <div
              key={i}
              className="absolute w-[1px] h-[1px] bg-gray-300"
              style={{
                left: `${x1}%`,
                top: `${y1}%`,
                width: '1px',
                height: '3px',
                transform: `rotate(${i * 6}deg)`,
              }}
            />
          );
        })}
      </div>

      {/* Mode switch button */}
      <button
        onClick={onSwitchMode}
        className="absolute bottom-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Keyboard className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}