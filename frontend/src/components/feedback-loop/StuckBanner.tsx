import React from 'react';
import { HelpCircle, Lightbulb, MessageSquare, X } from 'lucide-react';
import { StepId } from '../../types';

export interface StuckBannerProps {
  isVisible: boolean;
  stepId: StepId;
  onShowHint: () => void;
  onOpenFeedback: () => void;
  onDismiss: () => void;
}

export const StuckBanner: React.FC<StuckBannerProps> = ({
  isVisible,
  stepId,
  onShowHint,
  onOpenFeedback,
  onDismiss,
}) => {
  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Contextual assistance alert"
      className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-fade-in"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-900">
            Need help with Step {stepId}?
          </p>
          <p className="text-xs text-amber-700">
            It looks like you might be stuck. A hint is ready, or let us know what's difficult.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onShowHint}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          <span>Show Hint</span>
        </button>

        <button
          onClick={onOpenFeedback}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-amber-600"
        >
          <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Give Feedback</span>
        </button>

        <button
          onClick={onDismiss}
          aria-label="Dismiss assistance"
          className="p-1.5 text-amber-600 hover:text-amber-900 rounded-md hover:bg-amber-100 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
