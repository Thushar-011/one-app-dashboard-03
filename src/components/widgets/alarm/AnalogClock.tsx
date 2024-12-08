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
  // Function to calculate clock numbers
  const getNumbers = () => {
    return mode === 'hour'
      ? Array.from({ length: 12 }, (_, i) => i + 1) // 1 to 12 for hours
      : Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10... for minutes
  };

  // Function to calculate hand rotation
  const getHandRotation = () => {
    if (mode === 'hour') {
      // Adjust hour hand to match perfectly with selected hour
      return (value % 12) * 30 - 90; // 30° per hour (0° starts at 12 o'clock)
    } else {
      return value * 6 - 90; // 6° per minute
    }
  };

  // Handle user clicks on the clock face
  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    // Calculate angle from the center of the clock
    let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;

    if (mode === 'hour') {
      // For hours, divide by 30° and adjust for 12-hour format
      let hour = Math.round(angle / 30) % 12 || 12;
      onChange(hour);
    } else {
      // For minutes, divide by 6° for exact minute calculation
      let minute = Math.round(angle / 6) % 60;
      onChange(minute);
    }
  };

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Clock face */}
      <div
        className="absolute inset-0 rounded-full bg-white border-4 border-primary/20 cursor-pointer shadow-inner"
        onClick={handleClockClick}
      >
        {/* Clock numbers */}
        {getNumbers().map((num) => {
          // Calculate precise positions for numbers using trigonometry
          const angle = ((num * (mode === 'hour' ? 30 : 6)) - 90) * (Math.PI / 180);
          const radius = 48; // Adjusted radius for exact boundary alignment
          const x = 50 + radius * Math.cos(angle); // X position
          const y = 50 + radius * Math.sin(angle); // Y position

          const isSelected = mode === 'hour' ? value === num : value === num;

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

        {/* Clock hand */}
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

        {/* Minute markers (for minute mode) */}
        {mode === 'minute' &&
          Array.from({ length: 60 }).map((_, i) => {
            if (i % 5 === 0) return null; // Skip positions where numbers are
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const outerRadius = 46; // Outer radius for markers
            const innerRadius = 44; // Inner radius for spacing
            const x1 = 50 + outerRadius * Math.cos(angle);
            const y1 = 50 + outerRadius * Math.sin(angle);

            return (
              <div
                key={i}
                className="absolute bg-gray-300"
                style={{
                  left: `${x1}%`,
                  top: `${y1}%`,
                  width: '1px',
                  height: '3px',
                  transform: `translate(-50%, -50%)`,
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