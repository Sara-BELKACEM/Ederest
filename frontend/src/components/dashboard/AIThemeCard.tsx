import React from 'react';
import { Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { AITheme } from '../../types';

export interface AIThemeCardProps {
  theme: AITheme;
  isTopPriority?: boolean;
}

export const AIThemeCard: React.FC<AIThemeCardProps> = ({ theme, isTopPriority = false }) => {
  const totalSentiments =
    theme.sentimentBreakdown.positive +
    theme.sentimentBreakdown.neutral +
    theme.sentimentBreakdown.negative;

  const negPercent = Math.round((theme.sentimentBreakdown.negative / totalSentiments) * 100) || 0;
  const neutPercent = Math.round((theme.sentimentBreakdown.neutral / totalSentiments) * 100) || 0;
  const posPercent = Math.round((theme.sentimentBreakdown.positive / totalSentiments) * 100) || 0;

  return (
    <div
      className={`p-5 rounded-xl border bg-white shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
        isTopPriority
          ? 'border-rose-300 ring-2 ring-rose-500/10 bg-gradient-to-b from-rose-50/20 to-white'
          : 'border-[#E5E7EB]'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-md">
              <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" aria-hidden="true" />
              AI Theme
            </span>
            {isTopPriority && (
              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded uppercase tracking-wider">
                Top Blocker
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 flex items-center gap-1 font-semibold">
            <MessageSquare className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            {theme.commentCount} comments
          </span>
        </div>

        {/* Theme Title */}
        <h4 className="text-sm font-bold text-gray-900 mb-2 leading-snug">
          {theme.title}
        </h4>

        {/* Step link */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
          <span className="font-semibold text-gray-500">Related Step:</span>
          {theme.steps.map((s) => (
            <span
              key={s}
              className="bg-gray-100 text-gray-800 font-bold px-2 py-0.5 rounded text-[11px]"
            >
              Step {s}
            </span>
          ))}
        </div>

        {/* Summary */}
        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          {theme.summary}
        </p>
      </div>

      <div>
        {/* Sentiment Distribution mini-bar */}
        <div className="mb-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1">
            <span>Sentiment breakdown</span>
            <span className="text-rose-600 font-semibold">{negPercent}% Negative</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden flex">
            <div
              style={{ width: `${posPercent}%` }}
              className="bg-emerald-500"
              title={`${posPercent}% Positive`}
            />
            <div
              style={{ width: `${neutPercent}%` }}
              className="bg-amber-400"
              title={`${neutPercent}% Neutral`}
            />
            <div
              style={{ width: `${negPercent}%` }}
              className="bg-rose-500"
              title={`${negPercent}% Negative`}
            />
          </div>
        </div>

        {/* Suggested Action Box */}
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
            <ArrowRight className="w-3 h-3 text-[#4F46E5]" aria-hidden="true" />
            <span>Suggested Action</span>
          </div>
          <p className="text-xs font-medium text-slate-800">
            {theme.suggestedAction}
          </p>
        </div>
      </div>
    </div>
  );
};
