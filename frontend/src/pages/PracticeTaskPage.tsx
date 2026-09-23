import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Keyboard, ShieldAlert } from 'lucide-react';
import { StepId, FeedbackTrigger } from '../types';
import { PRACTICE_STEPS } from '../services/mockData';
import { StepGuide } from '../components/practice-task/StepGuide';
import { PracticeSoftware } from '../components/practice-task/PracticeSoftware';
import { StuckBanner } from '../components/feedback-loop/StuckBanner';
import { FeedbackWidget } from '../components/feedback-loop/FeedbackWidget';
import { useStuckDetection } from '../hooks/useStuckDetection';
import { sessionService } from '../services/sessionService';
import { eventService } from '../services/eventService';
import { Modal } from '../components/ui/Modal';

export interface PracticeTaskPageProps {
  onBackToCourses: () => void;
  onOpenDashboard: () => void;
}

export const PracticeTaskPage: React.FC<PracticeTaskPageProps> = ({
  onBackToCourses,
  onOpenDashboard,
}) => {
  const [currentStepId, setCurrentStepId] = useState<StepId>(1);
  const [supplier, setSupplier] = useState<string>('');
  const [product, setProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [feedbackTrigger, setFeedbackTrigger] = useState<FeedbackTrigger>('stuck');
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [keyboardHelpOpen, setKeyboardHelpOpen] = useState<boolean>(false);

  const sessionId = sessionService.getOrCreateSessionId();
  const currentStep = PRACTICE_STEPS[currentStepId - 1];

  // Callback when stuck moment is detected
  const handleStuckDetected = useCallback(
    (trigger: FeedbackTrigger) => {
      setFeedbackTrigger(trigger);
      eventService.recordEvent(sessionId, 'po-practice', currentStepId, 'stuck_detected', { trigger });
    },
    [sessionId, currentStepId]
  );

  const {
    isStuck,
    resetTimer,
    recordWrongClick,
    triggerStuckManually,
    dismissStuck,
  } = useStuckDetection({
    currentStep: currentStepId,
    onStuckDetected: handleStuckDetected,
    enabled: !isCompleted,
  });

  // Track initial step view
  useEffect(() => {
    eventService.recordEvent(sessionId, 'po-practice', currentStepId, 'step_view');
  }, [sessionId, currentStepId]);

  // Global Keyboard shortcuts: ? for hint, Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '?') {
        e.preventDefault();
        setIsHintOpen((prev) => !prev);
        eventService.recordEvent(sessionId, 'po-practice', currentStepId, 'hint_viewed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sessionId, currentStepId]);

  // Step transition handlers
  const handleSupplierChange = (val: string) => {
    setSupplier(val);
    resetTimer();
    eventService.recordEvent(sessionId, 'po-practice', 1, 'field_input', { supplier: val });
    if (val && currentStepId === 1) {
      setTimeout(() => {
        setCurrentStepId(2);
        eventService.recordEvent(sessionId, 'po-practice', 1, 'step_completed');
      }, 400);
    }
  };

  const handleProductChange = (val: string) => {
    setProduct(val);
    resetTimer();
    eventService.recordEvent(sessionId, 'po-practice', 2, 'field_input', { product: val });
    if (val && currentStepId === 2) {
      setTimeout(() => {
        setCurrentStepId(3);
        eventService.recordEvent(sessionId, 'po-practice', 2, 'step_completed');
      }, 400);
    }
  };

  const handleQuantityChange = (val: string) => {
    setQuantity(val);
    resetTimer();
    eventService.recordEvent(sessionId, 'po-practice', 3, 'field_input', { quantity: val });
    const parsed = parseInt(val, 10);
    if (parsed > 0 && currentStepId === 3) {
      // Allow user to finish typing, or proceed on blur/Enter
    }
  };

  const handleNextStep = () => {
    if (currentStepId === 3) {
      const parsed = parseInt(quantity, 10);
      if (parsed > 0) {
        setCurrentStepId(4);
        eventService.recordEvent(sessionId, 'po-practice', 3, 'step_completed');
      } else {
        recordWrongClick();
      }
    } else if (currentStepId < 4) {
      setCurrentStepId((prev) => (prev + 1) as StepId);
    }
  };

  const handlePrevStep = () => {
    if (currentStepId > 1) {
      setCurrentStepId((prev) => (prev - 1) as StepId);
    }
  };

  const handleSubmitPO = () => {
    setIsCompleted(true);
    eventService.recordEvent(sessionId, 'po-practice', 4, 'task_completed');
    setShowCompletionModal(true);
  };

  const handleResetTask = () => {
    sessionService.resetSession();
    setCurrentStepId(1);
    setSupplier('');
    setProduct('');
    setQuantity('');
    setIsCompleted(false);
    setIsHintOpen(false);
    setIsFeedbackOpen(false);
    setShowCompletionModal(false);
  };

  // Determine if next is enabled
  const canGoNext =
    (currentStepId === 1 && Boolean(supplier)) ||
    (currentStepId === 2 && Boolean(product)) ||
    (currentStepId === 3 && parseInt(quantity, 10) > 0) ||
    currentStepId === 4;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Breadcrumb & Task Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCourses}
            aria-label="Return to course catalog"
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">
                Purchase Order Practice
              </h1>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                Interactive Simulation
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Transaction ME21N · 4-step guided enterprise procurement task
            </p>
          </div>
        </div>

        {/* Task Utilities */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setKeyboardHelpOpen(true)}
            aria-label="View keyboard navigation shortcuts"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <Keyboard className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
            <span className="hidden sm:inline">Keyboard Nav</span>
          </button>

          <button
            onClick={handleResetTask}
            aria-label="Restart practice task from step 1"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => {
              setFeedbackTrigger('stuck');
              setIsFeedbackOpen(true);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-[#4F46E5] hover:bg-indigo-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* Contextual Stuck Alert Banner */}
      <StuckBanner
        isVisible={isStuck && !isFeedbackOpen}
        stepId={currentStepId}
        onShowHint={() => {
          setIsHintOpen(true);
          dismissStuck();
          eventService.recordEvent(sessionId, 'po-practice', currentStepId, 'hint_viewed');
        }}
        onOpenFeedback={() => {
          setFeedbackTrigger('stuck');
          setIsFeedbackOpen(true);
          dismissStuck();
        }}
        onDismiss={dismissStuck}
      />

      {/* 2-Column Split: Mock Software Interface (Left) + Persistent Step Guide (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Enterprise Mock Software Interface (8 cols) */}
        <div className="lg:col-span-8">
          <PracticeSoftware
            currentStep={currentStepId}
            supplier={supplier}
            onSupplierChange={handleSupplierChange}
            product={product}
            onProductChange={handleProductChange}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onSubmitPO={handleSubmitPO}
            onWrongInteraction={recordWrongClick}
            isCompleted={isCompleted}
          />
        </div>

        {/* Right: Persistent Guided Step Component (4 cols) */}
        <div className="lg:col-span-4 sticky top-20">
          <StepGuide
            step={currentStep}
            totalSteps={4}
            currentStepId={currentStepId}
            canGoBack={currentStepId > 1}
            canGoNext={canGoNext}
            onPrev={handlePrevStep}
            onNext={handleNextStep}
            isHintOpen={isHintOpen}
            onToggleHint={() => {
              setIsHintOpen((prev) => !prev);
              if (!isHintOpen) {
                eventService.recordEvent(sessionId, 'po-practice', currentStepId, 'hint_viewed');
              }
            }}
            onTriggerStuckManual={triggerStuckManually}
          />
        </div>
      </div>

      {/* Contextual Feedback Loop Widget */}
      <FeedbackWidget
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        stepId={currentStepId}
        taskId="po-practice"
        trigger={feedbackTrigger}
        onFeedbackSubmitted={() => {
          // Feedback captured
        }}
      />

      {/* Task Completion Celebration Dialog */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        title="Purchase Order Successfully Created! 🎉"
        description="Transaction ME21N completed with full enterprise validation."
      >
        <div className="space-y-4 text-xs text-gray-700">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold text-sm text-emerald-900">Purchase Order #PO-2026-9042</p>
              <p className="mt-1 leading-relaxed">
                You successfully selected an approved supplier, catalog item, specified order volume, and dispatched the requisition for approval.
              </p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200 p-3 rounded-lg flex justify-between text-xs font-semibold">
            <span>XP Earned:</span>
            <span className="text-amber-600 font-bold">+250 XP</span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
            <button
              onClick={() => {
                setShowCompletionModal(false);
                setFeedbackTrigger('completion');
                setIsFeedbackOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-[#4F46E5] hover:bg-indigo-100 font-semibold text-xs transition-colors"
            >
              Rate This Learning Experience
            </button>
            <button
              onClick={() => {
                setShowCompletionModal(false);
                onOpenDashboard();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs transition-colors"
            >
              View in Admin Dashboard &rarr;
            </button>
          </div>
        </div>
      </Modal>

      {/* Keyboard Accessibility Help Modal */}
      <Modal
        isOpen={keyboardHelpOpen}
        onClose={() => setKeyboardHelpOpen(false)}
        title="Full Keyboard Navigation Guide"
        description="The entire practice task and feedback loop are 100% operable without a mouse."
      >
        <div className="space-y-3 text-xs text-gray-700">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
            <span className="font-semibold">Tab / Shift + Tab</span>
            <span className="font-mono text-gray-500">Navigate forward / backward</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
            <span className="font-semibold">Enter / Space</span>
            <span className="font-mono text-gray-500">Select option / submit button</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
            <span className="font-semibold">Escape</span>
            <span className="font-mono text-gray-500">Close hint or feedback widget</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
            <span className="font-semibold">? (Question Mark)</span>
            <span className="font-mono text-gray-500">Toggle step hint panel</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
            <span className="font-semibold">Arrow Up / Down</span>
            <span className="font-mono text-gray-500">Change dropdown items</span>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setKeyboardHelpOpen(false)}
              className="px-4 py-2 bg-[#4F46E5] text-white font-semibold text-xs rounded-lg"
            >
              Got it
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
};
