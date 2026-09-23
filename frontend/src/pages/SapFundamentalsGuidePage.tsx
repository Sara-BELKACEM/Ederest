import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Keyboard, Award } from 'lucide-react';
import { StepId, FeedbackTrigger } from '../types';
import { SAP_COURSE_GUIDE_STEPS } from '../services/mockData';
import { CourseGuide } from '../components/course-guide/CourseGuide';
import { CourseContentView } from '../components/course-guide/CourseContentView';
import { StuckBanner } from '../components/feedback-loop/StuckBanner';
import { FeedbackWidget } from '../components/feedback-loop/FeedbackWidget';
import { useStuckDetection } from '../hooks/useStuckDetection';
import { sessionService } from '../services/sessionService';
import { eventService } from '../services/eventService';
import { Modal } from '../components/ui/Modal';

export interface SapFundamentalsGuidePageProps {
  onBackToCourseDetail: () => void;
  onOpenPurchaseOrderPractice: () => void;
  onOpenDashboard: () => void;
}

export const SapFundamentalsGuidePage: React.FC<SapFundamentalsGuidePageProps> = ({
  onBackToCourseDetail,
  onOpenPurchaseOrderPractice,
  onOpenDashboard,
}) => {
  const [currentStepId, setCurrentStepId] = useState<StepId>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(true);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [feedbackTrigger, setFeedbackTrigger] = useState<FeedbackTrigger>('stuck');
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [keyboardHelpOpen, setKeyboardHelpOpen] = useState<boolean>(false);
  const completedRef = useRef(false);

  const sessionId = sessionService.getOrCreateSessionId();
  const currentStep = SAP_COURSE_GUIDE_STEPS[currentStepId - 1];

  // Stuck moment detection callback
  const handleStuckDetected = useCallback(
    (trigger: FeedbackTrigger) => {
      setFeedbackTrigger(trigger);
      eventService.recordEvent(sessionId, 'sap-fundamentals-guide', currentStepId, 'stuck_detected', {
        courseId: 'sap-fundamentals',
        guideType: 'sap_fundamentals_course',
        trigger,
        hintsEnabled,
      });
    },
    [sessionId, currentStepId, hintsEnabled]
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
    eventService.recordEvent(sessionId, 'sap-fundamentals-guide', currentStepId, 'step_viewed', {
      courseId: 'sap-fundamentals',
      guideType: 'sap_fundamentals_course',
      hintsEnabled,
    });
  }, [sessionId, currentStepId, hintsEnabled]);

  useEffect(() => {
    eventService.recordEvent(sessionId, 'sap-fundamentals-guide', 1, 'course_started', {
      courseId: 'sap-fundamentals',
      guideType: 'sap_fundamentals_course',
    });

    return () => {
      if (!completedRef.current) {
        eventService.recordEvent(sessionId, 'sap-fundamentals-guide', currentStepId, 'course_abandoned', {
          courseId: 'sap-fundamentals',
          guideType: 'sap_fundamentals_course',
        });
      }
    };
  }, []);

  // Global Keyboard shortcuts: ? for hint, Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '?') {
        e.preventDefault();
        if (hintsEnabled) {
          setIsHintOpen((prev) => !prev);
          eventService.recordEvent(sessionId, 'sap-fundamentals-guide', currentStepId, 'hint_viewed', {
            courseId: 'sap-fundamentals',
            guideType: 'sap_fundamentals_course',
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sessionId, currentStepId, hintsEnabled]);

  // Navigation handlers
  const handleNextStep = () => {
    resetTimer();
    if (currentStepId < 4) {
      const nextId = (currentStepId + 1) as StepId;
      setCurrentStepId(nextId);
      setIsHintOpen(false);
      eventService.recordEvent(sessionId, 'sap-fundamentals-guide', currentStepId, 'step_completed', {
        courseId: 'sap-fundamentals',
        guideType: 'sap_fundamentals_course',
      });
    } else {
      completedRef.current = true;
      setIsCompleted(true);
      eventService.recordEvent(sessionId, 'sap-fundamentals-guide', 4, 'course_completed', {
        courseId: 'sap-fundamentals',
        guideType: 'sap_fundamentals_course',
      });
      setShowCompletionModal(true);
    }
  };

  const handlePrevStep = () => {
    resetTimer();
    if (currentStepId > 1) {
      setCurrentStepId((prev) => (prev - 1) as StepId);
      setIsHintOpen(false);
    }
  };

  const handleResetCourse = () => {
    sessionService.resetSession();
    setCurrentStepId(1);
    setIsCompleted(false);
    completedRef.current = false;
    setIsHintOpen(false);
    setIsFeedbackOpen(false);
    setShowCompletionModal(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCourseDetail}
            aria-label="Return to course overview"
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">
                SAP Fundamentals Course Guide
              </h1>
              <span className="text-[11px] font-semibold bg-[#EEF2FF] text-[#4F46E5] border border-indigo-200 px-2.5 py-0.5 rounded-full">
                Interactive Guided Curriculum
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Module: Core Enterprise Computing · Step {currentStepId} of 4
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
            onClick={handleResetCourse}
            aria-label="Restart course guide from step 1"
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
          if (hintsEnabled) setIsHintOpen(true);
          dismissStuck();
          eventService.recordEvent(sessionId, 'sap-fundamentals-guide', currentStepId, 'hint_viewed', {
            courseId: 'sap-fundamentals',
            guideType: 'sap_fundamentals_course',
          });
        }}
        onOpenFeedback={() => {
          setFeedbackTrigger('stuck');
          setIsFeedbackOpen(true);
          dismissStuck();
        }}
        onDismiss={dismissStuck}
      />

      {/* 2-Column Split: Educational Stage (Left) + Persistent Course Guide (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Educational Interactive Screen (8 cols) */}
        <div className="lg:col-span-8">
          <CourseContentView
            currentStepId={currentStepId}
            onAdvanceStep={handleNextStep}
            onOpenPurchaseOrderPractice={onOpenPurchaseOrderPractice}
          />
        </div>

        {/* Right: Persistent Course Guide Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-20">
          <CourseGuide
            step={currentStep}
            totalSteps={4}
            currentStepId={currentStepId}
            canGoBack={currentStepId > 1}
            canGoNext={true}
            onPrev={handlePrevStep}
            onNext={handleNextStep}
            hintsEnabled={hintsEnabled}
            onToggleHintsEnabled={() => {
              const nextState = !hintsEnabled;
              setHintsEnabled(nextState);
              if (!nextState) setIsHintOpen(false);
              eventService.recordEvent(sessionId, 'sap-fundamentals-guide', currentStepId, 'hint_toggled', {
                courseId: 'sap-fundamentals',
                guideType: 'sap_fundamentals_course',
                hintsEnabled: nextState,
              });
            }}
            isHintOpen={isHintOpen}
            onToggleHint={() => {
              if (hintsEnabled) {
                const nextOpen = !isHintOpen;
                setIsHintOpen(nextOpen);
                if (nextOpen) {
                  eventService.recordEvent(sessionId, 'sap-fundamentals-guide', currentStepId, 'hint_viewed', {
                    courseId: 'sap-fundamentals',
                    guideType: 'sap_fundamentals_course',
                  });
                }
              }
            }}
            onTriggerStuckManual={triggerStuckManually}
            onVoiceNext={handleNextStep}
            onVoiceBack={handlePrevStep}
          />
        </div>
      </div>

      {/* Contextual Feedback Widget */}
      <FeedbackWidget
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        stepId={currentStepId}
        taskId="sap-fundamentals-guide"
        courseId="sap-fundamentals"
        guideType="sap_fundamentals_course"
        trigger={feedbackTrigger}
        onFeedbackSubmitted={() => {
          eventService.recordEvent(sessionId, 'sap-fundamentals-guide', currentStepId, 'feedback_submitted', {
            courseId: 'sap-fundamentals',
            guideType: 'sap_fundamentals_course',
            trigger: feedbackTrigger,
          });
        }}
      />

      {/* Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        title="Congratulations! SAP Fundamentals Completed 🎓"
        description="You have successfully finished all 4 guided modules."
      >
        <div className="space-y-4 text-xs text-gray-700">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
            <Award className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold text-sm text-emerald-900">SAP Fundamentals Course Certificate</p>
              <p className="mt-1 leading-relaxed">
                You now understand ERP architecture, Master Data vs Transactions, and the end-to-end Procure-to-Pay business process.
              </p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200 p-3 rounded-lg flex justify-between text-xs font-semibold">
            <span>Certification XP:</span>
            <span className="text-amber-600 font-bold">+250 XP Awarded</span>
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
              Rate Course Experience
            </button>
            <button
              onClick={() => {
                setShowCompletionModal(false);
                onOpenPurchaseOrderPractice();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
            >
              Launch PO Practice Simulator &rarr;
            </button>
            <button
              onClick={() => {
                setShowCompletionModal(false);
                onOpenDashboard();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs transition-colors"
            >
              View Admin Analytics
            </button>
          </div>
        </div>
      </Modal>

      {/* Keyboard Accessibility Help Modal */}
      <Modal
        isOpen={keyboardHelpOpen}
        onClose={() => setKeyboardHelpOpen(false)}
        title="Keyboard Navigation Guide"
        description="The entire SAP Fundamentals Course Guide is operable without a mouse."
      >
        <div className="space-y-3 text-xs text-gray-700">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
            <span className="font-semibold">Tab / Shift + Tab</span>
            <span className="font-mono text-gray-500">Navigate forward / backward</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
            <span className="font-semibold">Enter / Space</span>
            <span className="font-mono text-gray-500">Select tab / activate button</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
            <span className="font-semibold">Escape</span>
            <span className="font-mono text-gray-500">Close hint or feedback widget</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
            <span className="font-semibold">? (Question Mark)</span>
            <span className="font-mono text-gray-500">Toggle course step hint</span>
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
