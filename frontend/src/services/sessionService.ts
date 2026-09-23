import { Session, StepId } from '../types';

const SESSION_STORAGE_KEY = 'ederest_anonymous_session_id';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'sess-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
}

export const sessionService = {
  getOrCreateSessionId(): string {
    let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!id) {
      id = generateUUID();
      sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    }
    return id;
  },

  getCurrentSession(currentStep: StepId = 1): Session {
    return {
      sessionId: this.getOrCreateSessionId(),
      startedAt: new Date().toISOString(),
      currentStep,
      hintsUsed: 0,
      wrongClicks: 0,
    };
  },

  resetSession(): string {
    const newId = generateUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, newId);
    return newId;
  },
};
