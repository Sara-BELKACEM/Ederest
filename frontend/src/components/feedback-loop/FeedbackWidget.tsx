import React, { useState, useEffect, useRef } from 'react';
import { Star, MessageSquare, X, Send, CheckCircle } from 'lucide-react';
import { FeedbackTrigger, StepId } from '../../types';
import { feedbackService } from '../../services/feedbackService';
import { sessionService } from '../../services/sessionService';

export interface FeedbackWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  stepId: StepId;
  taskId?: string;
  courseId?: string;
  guideType?: 'sap_fundamentals_course' | 'purchase_order';
  trigger: FeedbackTrigger;
  onFeedbackSubmitted?: () => void;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  isOpen,
  onClose,
  stepId,
  taskId = 'po-practice',
  courseId,
  guideType,
  trigger,
  onFeedbackSubmitted,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus management & Escape key
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setRating(0);
      setComment('');

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 50);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      const sessionId = sessionService.getOrCreateSessionId();
      await feedbackService.submitFeedback({
        sessionId,
        taskId,
        courseId,
        stepId,
        trigger,
        rating,
        comment,
        guideType,
      });

      onFeedbackSubmitted?.();
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerLabels: Record<FeedbackTrigger, string> = {
    stuck: 'Contextual Step Help & Feedback',
    leave: 'Before You Leave',
    completion: 'Practice Task Complete!',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-widget-title"
      ref={widgetRef}
      className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-200 animate-slide-up"
    >
      {/* Header banner */}
      <div className="bg-[#4F46E5] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-200" aria-hidden="true" />
          <h2 id="feedback-widget-title" className="text-xs font-semibold uppercase tracking-wider">
            {triggerLabels[trigger]}
          </h2>
        </div>
        <button
          ref={firstFocusableRef}
          onClick={onClose}
          aria-label="Close feedback widget (Escape)"
          className="text-indigo-200 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {isSuccess ? (
          <div className="py-6 text-center animate-fade-in">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" aria-hidden="true" />
            <h3 className="text-sm font-bold text-gray-900">Thank you for your feedback!</h3>
            <p className="text-xs text-gray-500 mt-1">
              Your anonymous input helps us improve this learning step.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step context pill */}
            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
              <span>Step {stepId} of 4</span>
              <span className="font-medium text-gray-700 capitalize">{trigger} check</span>
            </div>

            {/* Question 1: Rating */}
            <div>
              <label
                id="rating-label"
                className="block text-xs font-semibold text-gray-800 mb-2"
              >
                How difficult was this step? <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <div
                role="radiogroup"
                aria-labelledby="rating-label"
                className="flex items-center justify-between px-1"
              >
                {[1, 2, 3, 4, 5].map((val) => {
                  const ratingLabels = ['Very Hard', 'Hard', 'Neutral', 'Easy', 'Very Easy'];
                  const isFilled = (hoverRating || rating) >= val;
                  return (
                    <button
                      key={val}
                      type="button"
                      role="radio"
                      aria-checked={rating === val}
                      aria-label={`${val} star - ${ratingLabels[val - 1]}`}
                      onClick={() => setRating(val)}
                      onMouseEnter={() => setHoverRating(val)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 rounded-md text-gray-300 hover:text-amber-400 focus-visible:ring-2 focus-visible:ring-[#4F46E5] transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] text-gray-400 mt-1 px-1">
                <span>1 - Very Hard</span>
                <span>5 - Very Easy</span>
              </div>
            </div>

            {/* Question 2: Open comment */}
            <div>
              <label
                htmlFor="feedback-comment"
                className="block text-xs font-semibold text-gray-800 mb-1"
              >
                What was difficult? <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="feedback-comment"
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Unsure which field to complete, or instruction was vague..."
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] placeholder-gray-400 resize-none text-gray-900"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                🔒 Anonymous feedback only. Never share personal names or emails.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="text-xs px-3 py-1.5 font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#4F46E5]"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Submit</span>
                    <Send className="w-3 h-3" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
