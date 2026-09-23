import React from 'react';
import { AlertCircle, Clock, MousePointer } from 'lucide-react';
import { StepDropOffStat } from '../../types';

export interface DropOffChartProps {
  dropOffs: StepDropOffStat[];
}

export const DropOffChart: React.FC<DropOffChartProps> = ({ dropOffs }) => {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Learner Drop-off by Step
          </h3>
          <p className="text-xs text-gray-500">
            Measured drop-off percentage from anonymous session navigation events
          </p>
        </div>
        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
          Primary Bottleneck: Step 3 (34.8%)
        </span>
      </div>

      <div className="space-y-4">
        {dropOffs.map((item) => {
          const isBottleneck = item.stepId === 3;
          return (
            <div
              key={item.stepId}
              className={`p-3.5 rounded-xl border transition-all ${
                isBottleneck
                  ? 'bg-rose-50/40 border-rose-200 ring-1 ring-rose-300'
                  : 'bg-gray-50/60 border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between text-xs mb-2 gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      isBottleneck
                        ? 'bg-rose-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {item.stepId}
                  </span>
                  <span className="font-bold text-gray-900">{item.stepTitle}</span>
                  {isBottleneck && (
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-rose-200">
                      Highest Drop-off
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-[11px] text-gray-600">
                  <span className="flex items-center gap-1" title="Average duration on step">
                    <Clock className="w-3 h-3 text-gray-400" aria-hidden="true" />
                    {item.avgTimeSeconds}s avg
                  </span>
                  <span className="flex items-center gap-1" title="Average incorrect interactions before progress">
                    <MousePointer className="w-3 h-3 text-gray-400" aria-hidden="true" />
                    {item.wrongClicksAvg} wrong clicks
                  </span>
                  <span className="font-semibold text-gray-900">
                    {item.usersReached} reached &rarr; {item.usersCompleted} completed
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      isBottleneck
                        ? 'bg-rose-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {item.dropOffRatePercent}% drop-off
                  </span>
                </div>
              </div>

              {/* Progress Bar Visualizing Drop-off */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isBottleneck ? 'bg-rose-500' : 'bg-[#4F46E5]'
                  }`}
                  style={{ width: `${Math.min(100, item.dropOffRatePercent * 2.5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
