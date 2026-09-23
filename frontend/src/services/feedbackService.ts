import { FeedbackRecord, FeedbackTrigger, Sentiment, StepId, GuideType } from '../types';
import { MOCK_FEEDBACK_LIST, SAP_FEEDBACK_LIST } from './mockData';

const LOCAL_FEEDBACK_KEY = 'ederest_feedback_records';
const LOCAL_SAP_FEEDBACK_KEY = 'ederest_sap_feedback_records';

/** Client-side privacy guard: strips email and phone numbers */
function stripPII(text: string): string {
  if (!text) return '';
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const phoneRegex = /(\+?[0-9]{1,3}[-.\s]?)?(\(?[0-9]{2,4}\)?[-.\s]?)?[0-9]{3,4}[-.\s]?[0-9]{3,4}/g;
  return text.replace(emailRegex, '[REDACTED EMAIL]').replace(phoneRegex, '[REDACTED PHONE]');
}

function deriveSentiment(rating: number, comment?: string): Sentiment {
  const lower = (comment || '').toLowerCase();
  const negativeWords = ['stuck', 'hard', 'unclear', 'confusing', 'difficult', 'bug', 'failed', 'lost', 'difficile', 'pas clair', 'fatigue', 'jargon'];
  const positiveWords = ['easy', 'good', 'great', 'clear', 'helpful', 'facile', 'bien', 'utile', 'loved', 'smooth'];

  if (rating <= 2 || negativeWords.some((w) => lower.includes(w))) {
    return 'negative';
  }
  if (rating >= 4 || positiveWords.some((w) => lower.includes(w))) {
    return 'positive';
  }
  return 'neutral';
}

function getStoredFeedback(key: string, defaultList: FeedbackRecord[]): FeedbackRecord[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultList));
      return [...defaultList];
    }
    return JSON.parse(raw);
  } catch {
    return [...defaultList];
  }
}

function saveStoredFeedback(key: string, list: FeedbackRecord[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Storage quota or blocked
  }
}

export const feedbackService = {
  getAllFeedback(guideType?: GuideType): FeedbackRecord[] {
    if (guideType === 'sap_fundamentals_course') {
      return getStoredFeedback(LOCAL_SAP_FEEDBACK_KEY, SAP_FEEDBACK_LIST);
    }
    if (guideType === 'purchase_order') {
      return getStoredFeedback(LOCAL_FEEDBACK_KEY, MOCK_FEEDBACK_LIST);
    }
    const sapList = getStoredFeedback(LOCAL_SAP_FEEDBACK_KEY, SAP_FEEDBACK_LIST);
    const poList = getStoredFeedback(LOCAL_FEEDBACK_KEY, MOCK_FEEDBACK_LIST);
    return [...sapList, ...poList];
  },

  async submitFeedback(payload: {
    sessionId: string;
    courseId?: string;
    taskId: string;
    stepId: StepId;
    trigger: FeedbackTrigger;
    rating: number;
    comment?: string;
    guideType?: GuideType;
  }): Promise<FeedbackRecord> {
    const sanitizedComment = stripPII(payload.comment || '');
    const sentiment = deriveSentiment(payload.rating, sanitizedComment);
    const isSap = payload.guideType === 'sap_fundamentals_course' || payload.courseId === 'sap-fundamentals';
    const key = isSap ? LOCAL_SAP_FEEDBACK_KEY : LOCAL_FEEDBACK_KEY;
    const defaultList = isSap ? SAP_FEEDBACK_LIST : MOCK_FEEDBACK_LIST;

    const record: FeedbackRecord = {
      id: 'fb-' + Math.random().toString(36).substring(2, 9),
      sessionId: payload.sessionId,
      courseId: payload.courseId || (isSap ? 'sap-fundamentals' : 'po-practice'),
      taskId: payload.taskId,
      stepId: payload.stepId,
      trigger: payload.trigger,
      rating: payload.rating,
      comment: sanitizedComment,
      sentiment,
      timestamp: new Date().toISOString(),
      guideType: payload.guideType || (isSap ? 'sap_fundamentals_course' : 'purchase_order'),
    };

    // Save locally
    const current = getStoredFeedback(key, defaultList);
    const updated = [record, ...current];
    saveStoredFeedback(key, updated);

    return record;
  },

  resetToInitialMock() {
    localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(MOCK_FEEDBACK_LIST));
    localStorage.setItem(LOCAL_SAP_FEEDBACK_KEY, JSON.stringify(SAP_FEEDBACK_LIST));
  },
};
