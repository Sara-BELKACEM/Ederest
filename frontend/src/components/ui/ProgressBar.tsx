import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 - 100
  label?: string;
  showText?: boolean;
  height?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label = 'Progress',
  showText = false,
  height = 6,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center text-xs font-medium text-[#6B7280] mb-1.5">
          <span>{label}</span>
          <span className="text-[#4F46E5] font-semibold">{clampedValue}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full bg-[#E5E7EB] rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className="h-full bg-[#4F46E5] transition-all duration-300 ease-out rounded-full"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
