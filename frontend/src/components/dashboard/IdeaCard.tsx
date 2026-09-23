import React from 'react';
import { Eye, BookOpen, FlaskConical, BarChart3, User, Sparkles } from 'lucide-react';
import { IdeaCard as IdeaCardType } from '../../types';

export interface IdeaCardProps {
  idea: IdeaCardType;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const isA11y = idea.type === 'accessibility';

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] hover:border-[#4F46E5]/40 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              isA11y
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-indigo-50 text-[#4F46E5] border-indigo-200'
            }`}
          >
            {isA11y ? (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>Accessibility Improvement</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5 text-[#4F46E5]" aria-hidden="true" />
                <span>Learning Experience Idea</span>
              </>
            )}
          </span>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <User className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            <span>{idea.participant}</span>
          </div>
        </div>

        {/* Role & Moment */}
        <div className="mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            {idea.role}
          </span>
          <div className="mt-0.5 inline-block text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
            Target Moment: {idea.moment}
          </div>
        </div>

        {/* Idea Description */}
        <div className="my-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>The Product Idea</span>
          </h4>
          <p className="text-xs text-gray-700 font-medium leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
            "{idea.idea}"
          </p>
        </div>
      </div>

      {/* Validation & Measurement Plan */}
      <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
        <div className="flex items-start gap-2">
          <FlaskConical className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-gray-900">How to test: </strong>
            <span className="text-gray-600">{idea.howToTest}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-gray-900">How to measure: </strong>
            <span className="text-gray-600">{idea.howToMeasure}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
