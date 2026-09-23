import React from 'react';
import { CheckCircle2, AlertTriangle, MinusCircle, LogOut, Check, HelpCircle } from 'lucide-react';
import { Sentiment, FeedbackTrigger } from '../../types';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'sentiment' | 'trigger' | 'status' | 'default';
  sentiment?: Sentiment;
  trigger?: FeedbackTrigger;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  sentiment,
  trigger,
  className = '',
}) => {
  if (variant === 'sentiment' && sentiment) {
    const config = {
      positive: {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />,
        text: 'Positive',
      },
      neutral: {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <MinusCircle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />,
        text: 'Neutral',
      },
      negative: {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />,
        text: 'Negative',
      },
    }[sentiment];

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
      >
        {config.icon}
        <span>{children || config.text}</span>
      </span>
    );
  }

  if (variant === 'trigger' && trigger) {
    const config = {
      stuck: {
        bg: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <HelpCircle className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />,
        text: 'Stuck Trigger',
      },
      leave: {
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        icon: <LogOut className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />,
        text: 'Leave Trigger',
      },
      completion: {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />,
        text: 'Completion',
      },
    }[trigger];

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
      >
        {config.icon}
        <span>{children || config.text}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 ${className}`}
    >
      {children}
    </span>
  );
};
