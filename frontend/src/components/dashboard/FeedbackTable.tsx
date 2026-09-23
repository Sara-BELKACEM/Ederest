import React, { useState } from 'react';
import { Star, Filter } from 'lucide-react';
import { FeedbackRecord } from '../../types';
import { Badge } from '../ui/Badge';

export interface FeedbackTableProps {
  feedbackList: FeedbackRecord[];
}

export const FeedbackTable: React.FC<FeedbackTableProps> = ({ feedbackList }) => {
  const [selectedStep, setSelectedStep] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = feedbackList.filter((item) => {
    if (selectedStep !== 'all' && item.stepId.toString() !== selectedStep) {
      return false;
    }
    if (selectedSentiment !== 'all' && item.sentiment !== selectedSentiment) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchComment = item.comment?.toLowerCase().includes(q);
      if (!matchComment) return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Learner Feedback Stream ({filtered.length} entries)
          </h3>
          <p className="text-xs text-gray-500">
            Anonymous, privacy-sanitized comments with contextual trigger metadata
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Step Filter */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            <select
              value={selectedStep}
              onChange={(e) => setSelectedStep(e.target.value)}
              className="bg-transparent border-0 text-gray-700 font-medium focus:ring-0 text-xs py-0.5"
              aria-label="Filter by step"
            >
              <option value="all">All Steps</option>
              <option value="1">Step 1</option>
              <option value="2">Step 2</option>
              <option value="3">Step 3</option>
              <option value="4">Step 4</option>
            </select>
          </div>

          {/* Sentiment Filter */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs">
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="bg-transparent border-0 text-gray-700 font-medium focus:ring-0 text-xs py-0.5"
              aria-label="Filter by sentiment"
            >
              <option value="all">All Sentiments</option>
              <option value="negative">Negative Only</option>
              <option value="neutral">Neutral Only</option>
              <option value="positive">Positive Only</option>
            </select>
          </div>

          {/* Text Search */}
          <input
            type="text"
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-gray-900"
            aria-label="Search comments"
          />
        </div>
      </div>

      {/* Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600 border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Step</th>
              <th className="py-2.5 px-3">Rating</th>
              <th className="py-2.5 px-3">Learner Comment</th>
              <th className="py-2.5 px-3">Trigger</th>
              <th className="py-2.5 px-3">Sentiment</th>
              <th className="py-2.5 px-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No feedback records match the chosen filter.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-gray-900 whitespace-nowrap">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                      Step {item.stepId}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" aria-hidden="true" />
                      ))}
                      <span className="text-[11px] font-semibold text-gray-700 ml-1">
                        {item.rating}/5
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-gray-900 max-w-md">
                    {item.comment || <span className="text-gray-400 italic">No comment provided</span>}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <Badge variant="trigger" trigger={item.trigger} />
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {item.sentiment && <Badge variant="sentiment" sentiment={item.sentiment} />}
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-[11px] whitespace-nowrap font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
