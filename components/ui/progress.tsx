import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className = '' }: ProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`w-full bg-neutral-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 ease-out"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
