export type UserRole = 'learner' | 'admin';

export type StepId = 1 | 2 | 3 | 4;

export type FeedbackTrigger = 'stuck' | 'leave' | 'completion';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export type GuideType = 'sap_fundamentals_course' | 'purchase_order';

export interface IdeaCard {
  id: string;
  participant: string;
  role: string;
  type: 'accessibility' | 'learning_experience';
  moment: string;
  idea: string;
  howToTest: string;
  howToMeasure: string;
}

export interface Session {
  sessionId: string;
  courseId?: string;
  guideType?: GuideType;
  startedAt: string;
  completedAt?: string;
  currentStep: StepId;
  hintsUsed: number;
  wrongClicks: number;
}

export type EventType =
  | 'course_started'
  | 'step_view'
  | 'step_viewed'
  | 'field_focus'
  | 'field_input'
  | 'wrong_click'
  | 'hint_viewed'
  | 'hint_toggled'
  | 'stuck_detected'
  | 'feedback_opened'
  | 'feedback_submitted'
  | 'step_completed'
  | 'task_completed'
  | 'course_completed'
  | 'course_abandoned'
  | 'leave_attempt';

export interface LearningEvent {
  id: string;
  sessionId: string;
  courseId?: string;
  taskId: string;
  stepId: StepId;
  eventType: EventType;
  timestamp: string;
  guideType?: GuideType;
  metadata?: Record<string, unknown>;
}

export interface FeedbackRecord {
  id: string;
  sessionId: string;
  courseId?: string;
  taskId: string;
  stepId: StepId;
  trigger: FeedbackTrigger;
  rating: number; // 1 - 5
  comment?: string;
  sentiment?: Sentiment;
  timestamp: string;
  guideType?: GuideType;
}

export interface AITheme {
  id: string;
  title: string;
  commentCount: number;
  steps: StepId[];
  summary: string;
  suggestedAction: string;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface StepDefinition {
  id: StepId;
  stepNumber: number;
  title: string;
  instruction: string;
  detailedHelp: string;
  hint: string;
  fieldLabel: string;
  targetFieldId: string;
}

export interface SapCourseStepDefinition {
  id: StepId;
  stepNumber: number;
  title: string;
  subtitle: string;
  instruction: string;
  conceptSummary: string;
  hint: string;
  keyTakeaways: string[];
  interactiveElement: {
    type: 'concept_cards' | 'architecture_diagram' | 'process_flow' | 'knowledge_check';
    title: string;
  };
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  xp: number;
  progressPercent: number;
  subtasksCompleted: number;
  totalSubtasks: number;
  isInteractive: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  overview: string;
  learningObjectives: string[];
  interactiveTaskId?: string;
}

export interface StepDropOffStat {
  stepId: StepId;
  stepTitle: string;
  usersReached: number;
  usersCompleted: number;
  dropOffRatePercent: number;
  avgTimeSeconds: number;
  wrongClicksAvg: number;
}

export interface StepRatingStat {
  stepId: StepId;
  stepTitle: string;
  avgRating: number;
  totalRatings: number;
}

export interface TriggerResponseRateStat {
  stuck: number;
  leave: number;
  completion: number;
}

export interface DashboardInsights {
  kpis: {
    completionRate: number;
    dropOffRate: number;
    feedbackResponseRate: number;
    averageRating: number;
    totalSessions: number;
    totalFeedback: number;
  };
  triggerResponseRates: TriggerResponseRateStat;
  stepRatings: StepRatingStat[];
  stepDropOffs: StepDropOffStat[];
  aiThemes: AITheme[];
  recommendedFocus: {
    stepId: StepId;
    stepTitle: string;
    dropOffRatePercent: number;
    negativeCommentsCount: number;
    aiThemeTitle: string;
    why: string[];
    action: string;
  };
  ideaCards?: IdeaCard[];
}
