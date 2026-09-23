import React from 'react';
import { Target, CheckCircle2, ArrowRight } from 'lucide-react';
import { StepId } from '../../types';

export interface ActionableInsightSectionProps {
  recommendedFocus: {
    stepId: StepId;
    stepTitle: string;
    dropOffRatePercent: number;
    negativeCommentsCount: number;
    aiThemeTitle: string;
    why: string[];
    action: string;
  };
}

export const ActionableInsightSection: React.FC<ActionableInsightSectionProps> = ({
  recommendedFocus,
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-indigo-700/50">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-indigo-300">
            <Target className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-indigo-300 uppercase">
              Actionable Priority · Team Decision Engine
            </span>
            <h3 className="text-lg font-bold text-white">
              Recommended Focus: {recommendedFocus.stepTitle}
            </h3>
          </div>
        </div>

        <span className="bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-bold px-3 py-1 rounded-full">
          Fix First · Immediate Impact
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Why this step? */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-4">
          <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">
            Why Fix This Step First?
          </h4>
          <ul className="space-y-2 text-xs text-slate-200">
            {recommendedFocus.why.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Concrete Recommended Action */}
        <div className="bg-indigo-600/30 border border-indigo-400/40 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-indigo-300" aria-hidden="true" />
              <span>Recommended Team Action</span>
            </h4>
            <p className="text-xs font-semibold text-white leading-relaxed">
              "{recommendedFocus.action}"
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200">
            <span>Projected drop-off reduction:</span>
            <span className="font-bold text-emerald-400">~15–20%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
