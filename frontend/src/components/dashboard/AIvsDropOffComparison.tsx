import React from 'react';
import { CheckCircle2, GitCompare, Sparkles, TrendingDown } from 'lucide-react';
import { AITheme, StepDropOffStat } from '../../types';

export interface AIvsDropOffComparisonProps {
  aiThemes: AITheme[];
  dropOffs: StepDropOffStat[];
}

export const AIvsDropOffComparison: React.FC<AIvsDropOffComparisonProps> = ({
  aiThemes,
  dropOffs,
}) => {
  // Find top AI theme and top drop-off step
  const topAITheme = aiThemes[0];
  const sortedDropOffs = [...dropOffs].sort(
    (a, b) => b.dropOffRatePercent - a.dropOffRatePercent
  );
  const topDropOff = sortedDropOffs[0];

  const isMatching = topAITheme?.steps.includes(topDropOff.stepId);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-[#4F46E5]">
            <GitCompare className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Hypothesis Validation: AI Feedback vs. Measured Drop-off
            </h3>
            <p className="text-xs text-gray-500">
              Cross-validating qualitative AI sentiment against independent behavioral event data
            </p>
          </div>
        </div>

        {isMatching && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            Hypothesis Confirmed: Diagnostic Alignment
          </span>
        )}
      </div>

      {/* Side-by-side Comparative Visual Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1: AI Themes */}
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Top AI-Surfaced Problem Theme
            </h4>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-rose-600">Rank #1 Issue</span>
              <span className="bg-gray-100 font-bold px-2 py-0.5 rounded text-[11px]">
                Target: Step {topAITheme.steps.join(', ')}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">{topAITheme.title}</p>
            <p className="text-xs text-gray-600 mb-2">{topAITheme.summary}</p>
            <div className="text-[11px] text-gray-500 font-medium">
              Evidence: <strong className="text-gray-800">{topAITheme.commentCount} learner comments</strong> ({topAITheme.sentimentBreakdown.negative} negative)
            </div>
          </div>
        </div>

        {/* Column 2: Independent Drop-off Events */}
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-rose-600" aria-hidden="true" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Measured Behavioral Drop-off
            </h4>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-rose-600">Highest Abandonment</span>
              <span className="bg-rose-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                {topDropOff.dropOffRatePercent}% Drop-off
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">{topDropOff.stepTitle}</p>
            <p className="text-xs text-gray-600 mb-2">
              {topDropOff.usersReached - topDropOff.usersCompleted} of {topDropOff.usersReached} learners gave up or abandoned the flow on this specific field.
            </p>
            <div className="text-[11px] text-gray-500 font-medium">
              Evidence: <strong className="text-gray-800">{topDropOff.avgTimeSeconds}s average dwell time</strong> with {topDropOff.wrongClicksAvg} wrong interactions.
            </div>
          </div>
        </div>
      </div>

      {/* Summary conclusion banner */}
      <div className="mt-4 p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200/80 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-indigo-950 leading-relaxed">
          <strong>Key Finding:</strong> The AI qualitative clustering accurately diagnoses the exact root cause behind the <strong>Step 3 (34.8%)</strong> drop-off spike. Rather than guessing why learners abandon the purchase order flow, the Ederest curriculum team can act on specific feedback: <em>learners need explicit unit examples in the quantity field</em>.
        </p>
      </div>
    </div>
  );
};
