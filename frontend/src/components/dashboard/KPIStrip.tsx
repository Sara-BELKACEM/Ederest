import React from 'react';
import { CheckCircle2, TrendingDown, MessageSquare, Star } from 'lucide-react';
import { KPICard } from '../ui/KPICard';

export interface KPIStripProps {
  kpis: {
    completionRate: number;
    dropOffRate: number;
    feedbackResponseRate: number;
    averageRating: number;
    totalSessions: number;
    totalFeedback: number;
  };
}

export const KPIStrip: React.FC<KPIStripProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        label="Completion Rate"
        value={`${kpis.completionRate}%`}
        subtext={`${kpis.totalSessions} total learner attempts`}
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />}
        trend={{ direction: 'up', label: '+4.2%' }}
      />

      <KPICard
        label="Overall Drop-off Rate"
        value={`${kpis.dropOffRate}%`}
        subtext="Peak drop-off occurs on Step 3"
        icon={<TrendingDown className="w-5 h-5 text-rose-600" aria-hidden="true" />}
        trend={{ direction: 'down', label: '-2.1%' }}
        highlight
      />

      <KPICard
        label="Feedback Response Rate"
        value={`${kpis.feedbackResponseRate}%`}
        subtext="Triggered at stuck moments"
        icon={<MessageSquare className="w-5 h-5 text-[#4F46E5]" aria-hidden="true" />}
        trend={{ direction: 'up', label: 'High signal' }}
      />

      <KPICard
        label="Average Rating"
        value={`${kpis.averageRating} / 5`}
        subtext={`From ${kpis.totalFeedback} learner ratings`}
        icon={<Star className="w-5 h-5 text-amber-500 fill-amber-400" aria-hidden="true" />}
        trend={{ direction: 'neutral', label: 'Neutral' }}
      />
    </div>
  );
};
