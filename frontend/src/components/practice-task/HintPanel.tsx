import React from 'react';
import { Lightbulb, X } from 'lucide-react';
import { StepDefinition } from '../../types';

export interface HintPanelProps {
  step: StepDefinition;
  isOpen: boolean;
  onClose: () => void;
}

export const HintPanel: React.FC<HintPanelProps> = ({ step, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Step hint details"
      className="bg-[#EAF1FB] border border-[#BFDBFE] rounded-xl p-4 mt-3 shadow-sm transition-all duration-200 animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 bg-[#4F46E5]/10 rounded-lg text-[#4F46E5] flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
              Predefined Hint — Step {step.stepNumber}
            </h4>
            <p className="text-xs text-[#1E293B] mt-1 font-medium leading-relaxed">
              {step.hint}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Tip: {step.detailedHelp}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close hint"
          className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-white/50 transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
