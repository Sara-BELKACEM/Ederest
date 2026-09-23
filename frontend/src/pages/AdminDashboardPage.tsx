import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, Sparkles, BarChart3, MessageSquareText, Lightbulb } from 'lucide-react';
import { DashboardInsights, FeedbackRecord } from '../types';
import { insightService } from '../services/insightService';
import { feedbackService } from '../services/feedbackService';
import { KPIStrip } from '../components/dashboard/KPIStrip';
import { DropOffChart } from '../components/dashboard/DropOffChart';
import { AIThemeCard } from '../components/dashboard/AIThemeCard';
import { AIvsDropOffComparison } from '../components/dashboard/AIvsDropOffComparison';
import { ActionableInsightSection } from '../components/dashboard/ActionableInsightSection';
import { FeedbackTable } from '../components/dashboard/FeedbackTable';
import { IdeaCard } from '../components/dashboard/IdeaCard';

export const AdminDashboardPage: React.FC = () => {
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await insightService.getInsights();
      const list = feedbackService.getAllFeedback('sap_fundamentals_course');
      setInsights(data);
      setFeedbackList(list);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Optional Should-Have: Export insight summary as JSON/text file
  const handleExportSummary = () => {
    if (!insights) return;
    setIsExporting(true);

    const exportData = {
      exportTimestamp: new Date().toISOString(),
      kpis: insights.kpis,
      recommendedFocus: insights.recommendedFocus,
      aiThemes: insights.aiThemes,
      stepDropOffs: insights.stepDropOffs,
      stepRatings: insights.stepRatings,
      triggerResponseRates: insights.triggerResponseRates,
      feedback: feedbackList,
      ideaCards: insights.ideaCards,
      course: {
        id: 'sap-fundamentals',
        title: 'SAP Fundamentals',
        guideType: 'sap_fundamentals_course',
      },
      totalFeedbackRecords: feedbackList.length,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ederest-learner-insights-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  if (isLoading || !insights) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <RefreshCw className="w-8 h-8 text-[#4F46E5] animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-gray-600">Loading AI Insights & Drop-off Telemetry...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-md">
              Ederest Admin Intelligence
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Feed
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Learner Feedback Loop & Drop-off Intelligence
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Connecting real-time stuck moments with behavioral drop-off and AI thematic synthesis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            aria-label="Refresh dashboard data"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportSummary}
            disabled={isExporting}
            aria-label="Export insight summary report"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export Insights</span>
          </button>
        </div>
      </div>

      {/* 1. KPI Cards Row */}
      <section aria-label="Key Performance Indicators">
        <KPIStrip kpis={insights.kpis} />
      </section>

      <section aria-labelledby="sap-metrics-title" className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
            <h2 id="sap-metrics-title" className="text-base font-bold text-gray-900">
              SAP Fundamentals Course Guide Metrics
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">Mock demonstration values for the SAP Fundamentals course guide.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Response Rate by Trigger</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              {(['stuck', 'leave', 'completion'] as const).map((trigger) => (
                <div key={trigger} className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                  <p className="text-xl font-extrabold text-[#4F46E5]">{insights.triggerResponseRates[trigger]}%</p>
                  <p className="text-[11px] font-semibold text-gray-500 capitalize mt-1">{trigger}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Average Rating per Course Guide Step</h3>
            <div className="space-y-2">
              {insights.stepRatings.map((rating) => (
                <div key={rating.stepId} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700">Step {rating.stepId}</span>
                  <span className="font-bold text-amber-600">{rating.avgRating.toFixed(1)} / 5 <span className="font-normal text-gray-400">({rating.totalRatings} ratings)</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Actionable Priority: Recommended Focus Banner */}
      <section aria-label="Actionable Priority Recommendation">
        <ActionableInsightSection recommendedFocus={insights.recommendedFocus} />
      </section>

      {/* 3. AI vs Drop-off Comparison Panel */}
      <section aria-label="AI Themes versus Measured Drop-off Comparison">
        <AIvsDropOffComparison
          aiThemes={insights.aiThemes}
          dropOffs={insights.stepDropOffs}
        />
      </section>

      <section aria-labelledby="evidence-title" className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquareText className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
          <h2 id="evidence-title" className="text-base font-bold text-gray-900">AI Themes and Behavioral Evidence</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">What learners said is shown alongside what learners did. These signals are related for review, not presented as causal proof.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.aiThemes.map((theme) => {
            const dropOff = insights.stepDropOffs.find((item) => item.stepId === theme.steps[0]);
            return (
              <div key={theme.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-xs">
                <p className="font-bold text-gray-900">{theme.title}</p>
                <p className="mt-1 text-gray-600">Comments behind theme: {theme.commentCount}</p>
                <p className="text-gray-600">Related step{theme.steps.length > 1 ? 's' : ''}: {theme.steps.join(', ')}</p>
                <p className="mt-2 font-semibold text-[#4F46E5]">Independent behavioral evidence: {dropOff?.dropOffRatePercent ?? 0}% observed drop-off</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Drop-off by Step Breakdown */}
      <section aria-label="Drop-off by Step Analysis">
        <DropOffChart dropOffs={insights.stepDropOffs} />
        <p className="text-[11px] text-gray-500 mt-2">Independent Behavioral Evidence — SAP Fundamentals Course Guide. Drop-off is derived from session behavior, not survey answers.</p>
      </section>

      {/* 5. AI Learner Insights Themes */}
      <section aria-label="AI Learner Insights Themes" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
              <h2 className="text-base font-bold text-gray-900">
                AI-Generated Learner Insights ({insights.aiThemes.length} Key Themes)
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              Clustered qualitative feedback from stuck moments, leaving triggers, and completed sessions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.aiThemes.map((theme, index) => (
            <AIThemeCard
              key={theme.id}
              theme={theme}
              isTopPriority={index === 0}
            />
          ))}
        </div>
      </section>

      {/* 6. Raw Learner Feedback Stream */}
      <section aria-label="Raw Learner Feedback Records">
        <FeedbackTable feedbackList={feedbackList} />
      </section>

      <section aria-labelledby="ideas-title" className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" aria-hidden="true" />
          <div>
            <h2 id="ideas-title" className="text-base font-bold text-gray-900">SAP Fundamentals Idea Cards</h2>
            <p className="text-xs text-gray-500">Eight anonymous concepts tied to observed course moments.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {(insights.ideaCards || []).map((idea) => <IdeaCard key={idea.id} idea={idea} />)}
        </div>
      </section>
    </main>
  );
};
