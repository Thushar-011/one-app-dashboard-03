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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = angle < 0 ? angle + 360 : angle;
    
    if (mode === 'hour') {
      const hour = Math.round(((angle + 90) % 360) / 30);
      onChange({ ...value, hour: hour === 0 ? 12 : hour });
    } else {
      const minute = Math.round(((angle + 90) % 360) / 6);
      onChange({ ...value, minute: minute === 60 ? 0 : minute });
    }
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

        <motion.div
          className="absolute left-1/2 top-1/2 w-1 bg-primary origin-bottom"
          style={{
            height: '40%',
            transformOrigin: '50% 100%',
            rotate: mode === 'hour'
              ? value.hour * 30 - 90
              : value.minute * 6 - 90,
          }}
        />

        <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}