import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Volume2,
  Mic,
  MicOff,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react';
import { SapCourseStepDefinition, StepId } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';

export interface CourseGuideProps {
  step: SapCourseStepDefinition;
  totalSteps: number;
  currentStepId: StepId;
  canGoBack: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  hintsEnabled: boolean;
  onToggleHintsEnabled: () => void;
  isHintOpen: boolean;
  onToggleHint: () => void;
  onTriggerStuckManual?: () => void;
  onVoiceNext?: () => void;
  onVoiceBack?: () => void;
}

export const CourseGuide: React.FC<CourseGuideProps> = ({
  step,
  totalSteps,
  currentStepId,
  canGoBack,
  canGoNext,
  onPrev,
  onNext,
  hintsEnabled,
  onToggleHintsEnabled,
  isHintOpen,
  onToggleHint,
  onTriggerStuckManual,
  onVoiceNext,
  onVoiceBack,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  const progressPercent = Math.round((currentStepId / totalSteps) * 100);

  // Speech Synthesis: Read Aloud
  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = `${step.title}. ${step.subtitle}. ${step.instruction} ${
        isHintOpen && hintsEnabled ? `Hint: ${step.hint}` : ''
      }`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Browser Speech Recognition for voice commands ("next", "back", "repeat")
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setVoiceSupported(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript.trim().toLowerCase();
          setVoiceFeedback(`Heard: "${transcript}"`);

          if (transcript.includes('next')) {
            setVoiceFeedback('Voice command: Next');
            if (onVoiceNext) onVoiceNext();
            else onNext();
          } else if (transcript.includes('back') || transcript.includes('previous')) {
            setVoiceFeedback('Voice command: Back');
            if (onVoiceBack) onVoiceBack();
            else onPrev();
          } else if (transcript.includes('repeat')) {
            setVoiceFeedback('Voice command: Repeat');
            handleReadAloud();
          }

          setTimeout(() => setVoiceFeedback(''), 3000);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch {
        setVoiceSupported(false);
      }
    }
  }, [onNext, onPrev, onVoiceNext, onVoiceBack]);

  const toggleVoiceCommands = () => {
    if (!voiceSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setVoiceFeedback('');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setVoiceFeedback('Listening ("next", "back", "repeat")...');
      } catch {
        setIsListening(false);
      }
    }
  };

  return (
    <aside
      aria-label="SAP Fundamentals Course Guide"
      className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 flex flex-col justify-between"
    >
      <div>
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-md">
              Step {step.stepNumber} of {totalSteps}
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              {step.subtitle}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Read Aloud Button */}
            <button
              onClick={handleReadAloud}
              aria-label="Read step instruction aloud"
              title="Read aloud"
              className="p-1.5 text-gray-500 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Voice Recognition Toggle */}
            {voiceSupported && (
              <button
                onClick={toggleVoiceCommands}
                aria-label={isListening ? 'Disable voice commands' : 'Enable voice commands ("next", "back", "repeat")'}
                title={isListening ? 'Voice listening active' : 'Turn on voice control'}
                className={`p-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                  isListening
                    ? 'text-rose-600 bg-rose-50 ring-1 ring-rose-200 animate-pulse'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {isListening ? (
                  <Mic className="w-4 h-4 text-rose-600" aria-hidden="true" />
                ) : (
                  <MicOff className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            )}

            <span className="text-xs font-bold text-gray-700 ml-1">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Voice Feedback Banner */}
        {voiceFeedback && (
          <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-2 border border-indigo-100 animate-fade-in">
            {voiceFeedback}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <ProgressBar value={progressPercent} height={6} />
        </div>

        {/* Step Title & Instruction with ARIA Live Region */}
        <div aria-live="polite" className="space-y-2 mb-4">
          <h2 className="text-base font-extrabold text-[#111827] leading-snug">
            {step.title}
          </h2>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            {step.instruction}
          </p>
        </div>

        {/* Controls Strip: Hints ON/OFF Toggle + Show Hint Button */}
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 mb-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
              <span>Course Hints System</span>
            </span>

            {/* Hints ON/OFF Switch */}
            <button
              onClick={onToggleHintsEnabled}
              aria-label={hintsEnabled ? 'Disable hints for A/B testing' : 'Enable hints'}
              className="flex items-center gap-1 text-xs font-bold focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded p-0.5"
            >
              <span className={`text-[11px] ${hintsEnabled ? 'text-[#4F46E5]' : 'text-gray-400'}`}>
                {hintsEnabled ? 'Hints ON' : 'Hints OFF'}
              </span>
              {hintsEnabled ? (
                <ToggleRight className="w-5 h-5 text-[#4F46E5]" aria-hidden="true" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-gray-400" aria-hidden="true" />
              )}
            </button>
          </div>

          {hintsEnabled ? (
            <button
              onClick={onToggleHint}
              aria-expanded={isHintOpen}
              className={`w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                isHintOpen
                  ? 'bg-[#EAF1FB] text-[#1E3A8A] border-[#BFDBFE]'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Lightbulb className={`w-3.5 h-3.5 ${isHintOpen ? 'text-amber-500' : 'text-gray-400'}`} aria-hidden="true" />
              <span>{isHintOpen ? 'Hide Hint' : 'Show Step Hint'}</span>
            </button>
          ) : (
            <p className="text-[11px] text-gray-400 italic text-center py-1">
              Hints disabled (A/B testing mode active)
            </p>
          )}

          {/* Expanded Hint Content */}
          {hintsEnabled && isHintOpen && (
            <div
              role="region"
              aria-label="Course guide hint"
              className="bg-[#EAF1FB] border border-[#BFDBFE] rounded-lg p-3 text-xs text-[#1E3A8A] leading-relaxed animate-fade-in"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <strong className="block text-[11px] uppercase tracking-wider text-[#1E3A8A] mb-0.5">
                    Step {step.stepNumber} Hint
                  </strong>
                  <span>{step.hint}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Key Takeaways Checklist */}
        <div className="space-y-1.5 mb-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            What You Will Learn
          </h3>
          <ul className="space-y-1 text-xs text-gray-600">
            {step.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-3">
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
            aria-label={currentStepId === totalSteps ? 'Complete SAP Fundamentals Course' : 'Advance to next step'}
            className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#4F46E5]"
          >
            <span>{currentStepId === totalSteps ? 'Complete Course' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
};
