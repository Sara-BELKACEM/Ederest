import React from 'react';

export interface KPICardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  highlight?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  highlight = false,
}) => {
  return (
    <div
      className={`p-5 rounded-xl border bg-white shadow-sm transition-all duration-150 hover:shadow-md ${
        highlight ? 'border-[#4F46E5] ring-1 ring-[#4F46E5]/20' : 'border-[#E5E7EB]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-[#111827] mt-1">{value}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
          {icon}
        </div>
      </div>

      {(subtext || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-semibold flex items-center ${
                trend.direction === 'up'
                  ? 'text-emerald-600'
                  : trend.direction === 'down'
                  ? 'text-rose-600'
                  : 'text-gray-500'
              }`}
            >
              {trend.label}
            </span>
          )}
          {subtext && <span className="text-[#6B7280]">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
