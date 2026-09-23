import React from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, HelpCircle, Volume2 } from 'lucide-react';
import { StepDefinition, StepId } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { HintPanel } from './HintPanel';

export interface StepGuideProps {
  step: StepDefinition;
  totalSteps: number;
  currentStepId: StepId;
  canGoBack: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  isHintOpen: boolean;
  onToggleHint: () => void;
  onTriggerStuckManual?: () => void;
}

export const StepGuide: React.FC<StepGuideProps> = ({
  step,
  totalSteps,
  currentStepId,
  canGoBack,
  canGoNext,
  onPrev,
  onNext,
  isHintOpen,
  onToggleHint,
  onTriggerStuckManual,
}) => {
  const progressPercent = Math.round((currentStepId / totalSteps) * 100);

  // Optional Should-Have: Speech synthesis read-aloud
  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Step ${step.stepNumber}: ${step.title}. ${step.instruction}`
      );
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <aside
      aria-label="Practice Task Guide"
      className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-5 flex flex-col justify-between"
    >
      <div>
        {/* Step indicator header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-md">
            Step {step.stepNumber} of {totalSteps}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReadAloud}
              aria-label="Read step instruction aloud"
              title="Read aloud"
              className="p-1.5 text-gray-500 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="text-xs font-semibold text-gray-500">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <ProgressBar value={progressPercent} height={5} />
        </div>

        {/* Step title & instruction with ARIA live region */}
        <div aria-live="polite" className="space-y-2">
          <h2 className="text-lg font-bold text-[#111827]">
            {step.title}
          </h2>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            {step.instruction}
          </p>
        </div>

        {/* Hint button */}
        <div className="mt-4">
          <button
            onClick={onToggleHint}
            aria-expanded={isHintOpen}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
              isHintOpen
                ? 'bg-[#EAF1FB] text-[#1E3A8A] border-[#BFDBFE]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Lightbulb className={`w-3.5 h-3.5 ${isHintOpen ? 'text-amber-500' : 'text-gray-400'}`} aria-hidden="true" />
            <span>{isHintOpen ? 'Hide Hint' : 'Show Hint'}</span>
          </button>
        </div>

        {/* Hint panel expansion */}
        <HintPanel step={step} isOpen={isHintOpen} onClose={onToggleHint} />
      </div>

      {/* Navigation Controls */}
      <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          disabled={!canGoBack}
          aria-label="Go to previous step"
          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {onTriggerStuckManual && (
            <button
              onClick={onTriggerStuckManual}
              title="Test stuck detection trigger immediately"
              className="text-[11px] text-gray-400 hover:text-amber-600 underline focus-visible:ring-2 focus-visible:ring-amber-500 px-1"
            >
              Simulate Stuck
            </button>
          )}

          <button
            onClick={onNext}
            disabled={!canGoNext}
            aria-label="Advance to next step"
            className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#4F46E5]"
          >
            <span>{currentStepId === totalSteps ? 'Complete' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
};
