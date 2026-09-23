import { LearningEvent, EventType, StepId } from '../types';

const LOCAL_EVENTS_KEY = 'ederest_learning_events';

function getStoredEvents(): LearningEvent[] {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredEvents(events: LearningEvent[]) {
  try {
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
  } catch {
    // LocalStorage full or blocked
  }
}

export const eventService = {
  async recordEvent(
    sessionId: string,
    taskId: string,
    stepId: StepId,
    eventType: EventType,
    metadata?: Record<string, unknown>
  ): Promise<LearningEvent> {
    const event: LearningEvent = {
      id: 'evt-' + Math.random().toString(36).substring(2, 9),
      sessionId,
      taskId,
      stepId,
      eventType,
      timestamp: new Date().toISOString(),
      courseId: typeof metadata?.courseId === 'string' ? metadata.courseId : undefined,
      guideType: metadata?.guideType === 'sap_fundamentals_course' || metadata?.guideType === 'purchase_order'
        ? metadata.guideType
        : undefined,
      metadata,
    };

    // Save locally for instant live demo persistence
    const current = getStoredEvents();
    current.push(event);
    saveStoredEvents(current);

    return event;
  },

  getLocalEvents(): LearningEvent[] {
    return getStoredEvents();
  },
};
