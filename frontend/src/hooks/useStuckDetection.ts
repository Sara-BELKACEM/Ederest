import { useState, useEffect, useRef, useCallback } from 'react';
import { FeedbackTrigger, StepId } from '../types';

/**
 * Configurable timeout constant for stuck moment detection.
 * Set to 20 seconds as required by specification.
 * Can be changed in one single place for testing or demos.
 */
export const STUCK_TIMEOUT_MS = 20_000;
export const WRONG_CLICK_THRESHOLD = 3;

export interface UseStuckDetectionProps {
  currentStep: StepId;
  onStuckDetected: (trigger: FeedbackTrigger) => void;
  enabled?: boolean;
}

export function useStuckDetection({
  currentStep,
  onStuckDetected,
  enabled = true,
}: UseStuckDetectionProps) {
  const [isStuck, setIsStuck] = useState<boolean>(false);
  const [wrongClicks, setWrongClicks] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset timer on user progress or step change
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsStuck(false);

    if (!enabled) return;

    timerRef.current = setTimeout(() => {
      setIsStuck(true);
      onStuckDetected('stuck');
    }, STUCK_TIMEOUT_MS);
  }, [enabled, onStuckDetected]);

  // Restart timer when step changes
  useEffect(() => {
    setWrongClicks(0);
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentStep, resetTimer]);

  // Handler for off-target or invalid clicks
  const recordWrongClick = useCallback(() => {
    setWrongClicks((prev) => {
      const next = prev + 1;
      if (next >= WRONG_CLICK_THRESHOLD) {
        setIsStuck(true);
        onStuckDetected('stuck');
      }
      return next;
    });
  }, [onStuckDetected]);

  // Detect leave attempts (e.g. mouse leaving top of window or switching tabs)
  useEffect(() => {
    if (!enabled) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        onStuckDetected('leave');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        onStuckDetected('leave');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, onStuckDetected]);

  return {
    isStuck,
    wrongClicks,
    resetTimer,
    recordWrongClick,
    triggerStuckManually: () => {
      setIsStuck(true);
      onStuckDetected('stuck');
    },
    dismissStuck: () => setIsStuck(false),
  };
}
